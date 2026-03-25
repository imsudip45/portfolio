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
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    if (!redis) {
      return new Response(JSON.stringify({ ok: false, error: 'Redis not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = getCookie(request, ADMIN_COOKIE);
    if (token) {
      await redis.del(`admin:session:${token}`);
    }

    const isProd = process.env.NODE_ENV === 'production';
    const cookie = [
      `${ADMIN_COOKIE}=`,
      'HttpOnly',
      'Path=/',
      `Max-Age=0`,
      'SameSite=Lax',
      isProd ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ');

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    });
  },
};

