import { Router, json } from 'itty-router';
import { handleDemo } from './routes/demo';
import { handleContact } from './routes/contact';
import { handleTrialSignup } from './routes/trial-signup';
const router = Router();
// Ping endpoint
router.get('/api/ping', (request, env) => {
    const ping = env?.PING_MESSAGE ?? 'ping';
    return json({ message: ping });
});
// Demo endpoint
router.get('/api/demo', (request, env) => handleDemo(request, env));
// Contact endpoint
router.post('/api/contact', (request, env) => handleContact(request, env));
// Trial signup endpoint
router.post('/api/trial-signup', (request, env) => handleTrialSignup(request, env));
// 404 handler
router.all('*', () => {
    return json({ error: 'Not Found' }, { status: 404 });
});
function addCorsHeaders(response) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    newResponse.headers.set('Access-Control-Max-Age', '86400');
    return newResponse;
}
export default {
    fetch: (request, env, ctx) => {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return addCorsHeaders(new Response(null, { status: 204 }));
        }
        try {
            const response = router.handle(request, env, ctx);
            return Promise.resolve(response).then(addCorsHeaders);
        }
        catch (err) {
            console.error('Router error:', err);
            return addCorsHeaders(json({ error: 'Internal Server Error' }, { status: 500 }));
        }
    },
};
