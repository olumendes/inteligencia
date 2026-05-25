import { DemoResponse } from '../shared/api';

export const handleDemo = (request: Request): Response => {
  const response: DemoResponse = {
    message: 'Hello from Cloudflare Workers',
  };
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
};
