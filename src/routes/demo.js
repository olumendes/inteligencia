import { json } from 'itty-router';
export const handleDemo = (request, env) => {
    const response = {
        message: 'Hello from Cloudflare Workers',
    };
    return json(response);
};
