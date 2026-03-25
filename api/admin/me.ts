import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  redis = null;
}

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

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });

    const token = getCookie(request, ADMIN_COOKIE);
    if (!token) {
      return Response.json({ authenticated: false });
    }

    if (!redis) return Response.json({ authenticated: false });

    const exists = await redis.get(`admin:session:${token}`);
    return Response.json({ authenticated: exists !== null && exists !== undefined });
  },
};

