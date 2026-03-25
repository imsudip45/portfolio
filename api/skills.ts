import { Redis } from '@upstash/redis';
import { skills as defaultSkills } from '../src/data/skills';
import { Skill } from '../src/types';

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  redis = null;
}

const SKILLS_KEY = 'skills';
const ADMIN_COOKIE = 'admin_session';

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(';').map((p) => p.trim());
  for (const part of parts) {
    const idx = part.indexOf('=');
    const key = idx === -1 ? part : part.slice(0, idx);
    if (key === name) {
      const value = idx === -1 ? '' : part.slice(idx + 1);
      return decodeURIComponent(value);
    }
  }
  return null;
}

async function requireAdmin(request: Request): Promise<boolean> {
  if (!redis) return false;
  const token = getCookie(request, ADMIN_COOKIE);
  if (!token) return false;
  const exists = await redis.get(`admin:session:${token}`);
  return exists !== null && exists !== undefined;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

function normalizeSkill(input: unknown, fallbackId?: string): Skill | null {
  if (!input || typeof input !== 'object') return null;
  const obj = input as Record<string, unknown>;

  const id = typeof obj.id === 'string' && obj.id.trim().length > 0 ? obj.id : fallbackId;
  const name = typeof obj.name === 'string' ? obj.name.trim() : '';
  const icon = typeof obj.icon === 'string' && obj.icon.trim().length > 0 ? obj.icon.trim() : '';
  const category = typeof obj.category === 'string' ? obj.category.trim() : '';

  if (!id || !name || !icon || !category) return null;

  return { id, name, icon, category };
}

async function readAllSkills(): Promise<Skill[]> {
  if (!redis) return defaultSkills;

  const raw = await redis.get(SKILLS_KEY);
  if (!raw) {
    await redis.set(SKILLS_KEY, JSON.stringify(defaultSkills));
    return defaultSkills;
  }

  try {
    const parsed = JSON.parse(raw) as Skill[];
    if (!Array.isArray(parsed)) return defaultSkills;
    return parsed;
  } catch {
    return defaultSkills;
  }
}

async function writeAllSkills(skills: Skill[]): Promise<void> {
  if (!redis) throw new Error('Redis not configured');
  await redis.set(SKILLS_KEY, JSON.stringify(skills));
}

async function handleGet(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const all = await readAllSkills();
  if (!id) return Response.json({ skills: all });

  const skill = all.find((s) => s.id === id) || null;
  return skill ? Response.json({ skill }) : new Response('Not found', { status: 404 });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      if (request.method === 'GET') return await handleGet(request);

      if (!redis) return new Response('Redis not configured', { status: 503 });

      const ok = await requireAdmin(request);
      if (!ok) return new Response('Unauthorized', { status: 401 });

      if (request.method === 'POST') {
        const body: unknown = await request.json().catch(() => null);
        const id = generateId();
        const skill = normalizeSkill(body, id);
        if (!skill) return new Response('Invalid payload', { status: 400 });

        const skills = await readAllSkills();
        skills.push(skill);
        await writeAllSkills(skills);
        return Response.json({ skill }, { status: 201 });
      }

      if (request.method === 'PUT') {
        const body: unknown = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') return new Response('Invalid payload', { status: 400 });

        const obj = body as Record<string, unknown>;
        const id = typeof obj.id === 'string' ? obj.id : '';
        if (!id) return new Response('Missing id', { status: 400 });

        const updated = normalizeSkill(body, id);
        if (!updated) return new Response('Invalid payload', { status: 400 });

        const skills = await readAllSkills();
        const idx = skills.findIndex((s) => s.id === id);
        if (idx === -1) return new Response('Not found', { status: 404 });

        skills[idx] = updated;
        await writeAllSkills(skills);
        return Response.json({ skill: updated });
      }

      if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return new Response('Missing id', { status: 400 });

        const skills = await readAllSkills();
        const next = skills.filter((s) => s.id !== id);
        if (next.length === skills.length) return new Response('Not found', { status: 404 });

        await writeAllSkills(next);
        return new Response(null, { status: 204 });
      }

      return new Response('Unhandled', { status: 500 });
    } catch {
      return new Response('Server error', { status: 500 });
    }
  },
};

