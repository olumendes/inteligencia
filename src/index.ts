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

const router = Router();

// Ping endpoint
router.get('/api/ping', (request: Request, env: Env) => {
  const ping = env?.PING_MESSAGE ?? 'ping';
  return json({ message: ping });
});

// Demo endpoint
router.get('/api/demo', (request: Request, env: Env) => handleDemo(request, env));

// Contact endpoint
router.post('/api/contact', (request: Request, env: Env) => handleContact(request, env));

// Trial signup endpoint
router.post('/api/trial-signup', (request: Request, env: Env) => handleTrialSignup(request, env));

// 404 handler
router.all('*', () => {
  return json({ error: 'Not Found' }, { status: 404 });
});

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      return router.handle(request, env, ctx);
    } catch (err) {
      console.error('Router error:', err);
      return json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },
};
