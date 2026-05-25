import { json } from 'itty-router';
import { DemoResponse } from '../shared/api';

interface Env {
  RESEND_API_KEY: string;
}

export const handleDemo = (request: Request, env: Env): Response => {
  const response: DemoResponse = {
    message: 'Hello from Cloudflare Workers',
  };
  return json(response);
};
