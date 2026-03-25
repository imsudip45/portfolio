import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch {
  redis = null;
}

const ADMIN_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

function generateSessionToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
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

    const body = await request.json().catch(() => null);
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const expectedUsername = process.env.ADMIN_USERNAME ?? 'sudip@45';
    const expectedPassword = process.env.ADMIN_PASSWORD ?? 'Iamtheadmin@45';

    if (!username || !password) return new Response('Bad Request', { status: 400 });
    if (username !== expectedUsername || password !== expectedPassword) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = generateSessionToken();
    const sessionKey = `admin:session:${token}`;

    await redis.set(sessionKey, '1', { ex: SESSION_TTL_SECONDS });

    const isProd = process.env.NODE_ENV === 'production';
    const cookie = [
      `${ADMIN_COOKIE}=${encodeURIComponent(token)}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${SESSION_TTL_SECONDS}`,
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

