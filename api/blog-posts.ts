import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  // If Upstash env vars aren't configured yet, keep GET routes working (empty data),
  // and fail writes/auth cleanly.
  redis = null;
}

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  tags: string[];
  imageUrl?: string;
};

const BLOGS_KEY = 'blogPosts';
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

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function isValidTags(tags: unknown): tags is string[] {
  if (!Array.isArray(tags)) return false;
  return tags.every((t) => typeof t === 'string' && t.trim().length > 0);
}

async function requireAdmin(request: Request): Promise<boolean> {
  if (!redis) return false;
  const token = getCookie(request, ADMIN_COOKIE);
  if (!token) return false;

  const sessionKey = `admin:session:${token}`;
  const exists = await redis.get(sessionKey);
  return exists !== null && exists !== undefined;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

function normalizeBlogPost(input: unknown, fallbackId?: string): BlogPost | null {
  if (!input || typeof input !== 'object') return null;

  const obj = input as Record<string, unknown>;

  const id = typeof obj.id === 'string' && obj.id.trim().length > 0 ? obj.id : fallbackId;
  const title = typeof obj.title === 'string' ? obj.title.trim() : '';
  const content = typeof obj.content === 'string' ? obj.content.trim() : '';
  const excerpt =
    typeof obj.excerpt === 'string' && obj.excerpt.trim().length > 0
      ? obj.excerpt.trim()
      : content.substring(0, 150) + (content.length > 150 ? '...' : '');

  const tags = obj.tags;
  const imageUrl = typeof obj.imageUrl === 'string' && obj.imageUrl.trim().length > 0 ? obj.imageUrl.trim() : undefined;
  const date =
    typeof obj.date === 'string' && obj.date.trim().length > 0
      ? obj.date.trim()
      : new Date().toISOString().split('T')[0];

  const readTime =
    typeof obj.readTime === 'string' && obj.readTime.trim().length > 0 ? obj.readTime.trim() : calculateReadTime(content);

  if (!id || !title || !content || !isValidTags(tags)) return null;

  return {
    id,
    title,
    excerpt,
    content,
    date,
    readTime,
    tags,
    imageUrl,
  };
}

async function readAllPosts(): Promise<BlogPost[]> {
  if (!redis) return [];
  const raw = await redis.get(BLOGS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

async function writeAllPosts(posts: BlogPost[]): Promise<void> {
  if (!redis) throw new Error('Redis not configured');
  await redis.set(BLOGS_KEY, JSON.stringify(posts));
}

async function handleGet(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const posts = await readAllPosts();
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!id) {
    return Response.json({ posts: sorted });
  }

  const post = sorted.find((p) => p.id === id);
  if (!post) return new Response('Not found', { status: 404 });
  return Response.json({ post });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      if (request.method === 'GET') {
        return await handleGet(request);
      }

      if (!redis) {
        return new Response('Redis not configured', { status: 503 });
      }

      // Writes require admin session.
      const ok = await requireAdmin(request);
      if (!ok) return new Response('Unauthorized', { status: 401 });

      if (request.method === 'POST') {
        const body: unknown = await request.json().catch(() => null);
        const id = generateId();
        const post = normalizeBlogPost(body, id);
        if (!post) return new Response('Invalid payload', { status: 400 });

        const posts = await readAllPosts();
        posts.push(post);
        await writeAllPosts(posts);
        return Response.json({ post }, { status: 201 });
      }

      if (request.method === 'PUT') {
        const body: unknown = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') return new Response('Invalid payload', { status: 400 });

        const id = typeof (body as { id?: unknown }).id === 'string' ? ((body as { id: string }).id as string) : '';
        if (!id) return new Response('Missing id', { status: 400 });

        const updated = normalizeBlogPost(body, id);
        if (!updated) return new Response('Invalid payload', { status: 400 });

        const posts = await readAllPosts();
        const idx = posts.findIndex((p) => p.id === id);
        if (idx === -1) return new Response('Not found', { status: 404 });

        posts[idx] = updated;
        await writeAllPosts(posts);
        return Response.json({ post: updated });
      }

      if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return new Response('Missing id', { status: 400 });

        const posts = await readAllPosts();
        const next = posts.filter((p) => p.id !== id);
        if (next.length === posts.length) return new Response('Not found', { status: 404 });

        await writeAllPosts(next);
        return new Response(null, { status: 204 });
      }

      return new Response('Unhandled', { status: 500 });
    } catch {
      return new Response('Server error', { status: 500 });
    }
  },
};

