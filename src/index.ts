import { Router, json } from 'itty-router';
import { handleDemo } from './routes/demo';
import { handleContact } from './routes/contact';
import { handleTrialSignup } from './routes/trial-signup';

interface Env {
  PING_MESSAGE?: string;
  RESEND_API_KEY: string;
  GMAIL_USER?: string;
  GMAIL_APP_PASSWORD?: string;
}

const router = Router<{ Bindings: Env }>();

// Ping endpoint
router.get('/api/ping', (request, { PING_MESSAGE }) => {
  const ping = PING_MESSAGE ?? 'ping';
  return json({ message: ping });
});

// Demo endpoint
router.get('/api/demo', handleDemo);

// Contact endpoint
router.post('/api/contact', handleContact);

// Trial signup endpoint
router.post('/api/trial-signup', handleTrialSignup);

// 404 handler
router.all('*', () => {
  return new Response('{"error":"Not Found"}', {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(request, env, ctx).catch(err => {
      console.error('Router error:', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }),
};
