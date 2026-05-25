import { Router } from 'itty-router';
import { handleDemo } from './routes/demo';
import { handleContact } from './routes/contact';
import { handleTrialSignup } from './routes/trial-signup';

const router = Router();

// Ping endpoint
router.get('/api/ping', (request, env) => {
  const ping = env.PING_MESSAGE ?? 'ping';
  return new Response(JSON.stringify({ message: ping }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Demo endpoint
router.get('/api/demo', handleDemo);

// Contact endpoint
router.post('/api/contact', (request, env) => handleContact(request, env));

// Trial signup endpoint
router.post('/api/trial-signup', (request, env) => handleTrialSignup(request, env));

// 404 handler
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(request, env, ctx),
};

interface Env {
  PING_MESSAGE?: string;
  RESEND_API_KEY: string;
  GMAIL_USER?: string;
  GMAIL_APP_PASSWORD?: string;
}

declare const Env: Env;
