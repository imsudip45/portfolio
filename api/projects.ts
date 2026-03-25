import { Redis } from '@upstash/redis';
import { projects as defaultProjects } from '../src/data/projects';
import { Project } from '../src/types';

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  redis = null;
}

const PROJECTS_KEY = 'projects';
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

function normalizeProject(input: unknown, fallbackId?: string): Project | null {
  if (!input || typeof input !== 'object') return null;
  const obj = input as Record<string, unknown>;

  const id = typeof obj.id === 'string' && obj.id.trim().length > 0 ? obj.id : fallbackId;
  const title = typeof obj.title === 'string' ? obj.title.trim() : '';
  const description = typeof obj.description === 'string' ? obj.description.trim() : '';

  const technologiesRaw = obj.technologies;
  const technologies =
    Array.isArray(technologiesRaw) && technologiesRaw.every((t) => typeof t === 'string')
      ? (technologiesRaw as string[]).map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

  const imageUrl = typeof obj.imageUrl === 'string' && obj.imageUrl.trim().length > 0 ? obj.imageUrl.trim() : undefined;
  const githubUrl = typeof obj.githubUrl === 'string' && obj.githubUrl.trim().length > 0 ? obj.githubUrl.trim() : undefined;
  const liveUrl = typeof obj.liveUrl === 'string' && obj.liveUrl.trim().length > 0 ? obj.liveUrl.trim() : undefined;
  const autoPreview = typeof obj.autoPreview === 'boolean' ? obj.autoPreview : undefined;

  if (!id || !title || !description) return null;
  if (technologies.length === 0) return null;

  return {
    id,
    title,
    description,
    technologies,
    imageUrl,
    githubUrl,
    liveUrl,
    autoPreview,
  };
}

async function readAllProjects(): Promise<Project[]> {
  if (!redis) return defaultProjects;

  const raw = await redis.get(PROJECTS_KEY);
  if (!raw) {
    await redis.set(PROJECTS_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }

  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return defaultProjects;
    return parsed;
  } catch {
    return defaultProjects;
  }
}

async function writeAllProjects(projects: Project[]): Promise<void> {
  if (!redis) throw new Error('Redis not configured');
  await redis.set(PROJECTS_KEY, JSON.stringify(projects));
}

async function handleGet(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const all = await readAllProjects();
  if (!id) return Response.json({ projects: all });

  const project = all.find((p) => p.id === id) || null;
  return project ? Response.json({ project }) : new Response('Not found', { status: 404 });
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
        const project = normalizeProject(body, id);
        if (!project) return new Response('Invalid payload', { status: 400 });

        const projects = await readAllProjects();
        projects.push(project);
        await writeAllProjects(projects);
        return Response.json({ project }, { status: 201 });
      }

      if (request.method === 'PUT') {
        const body: unknown = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') return new Response('Invalid payload', { status: 400 });

        const obj = body as Record<string, unknown>;
        const id = typeof obj.id === 'string' ? obj.id : '';
        if (!id) return new Response('Missing id', { status: 400 });

        const updated = normalizeProject(body, id);
        if (!updated) return new Response('Invalid payload', { status: 400 });

        const projects = await readAllProjects();
        const idx = projects.findIndex((p) => p.id === id);
        if (idx === -1) return new Response('Not found', { status: 404 });

        projects[idx] = updated;
        await writeAllProjects(projects);
        return Response.json({ project: updated });
      }

      if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return new Response('Missing id', { status: 400 });

        const projects = await readAllProjects();
        const next = projects.filter((p) => p.id !== id);
        if (next.length === projects.length) return new Response('Not found', { status: 404 });

        await writeAllProjects(next);
        return new Response(null, { status: 204 });
      }

      return new Response('Unhandled', { status: 500 });
    } catch {
      return new Response('Server error', { status: 500 });
    }
  },
};

