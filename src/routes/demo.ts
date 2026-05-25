import { json } from 'itty-router';
import { DemoResponse } from '../shared/api';

export const handleDemo = (request: Request): Response => {
  const response: DemoResponse = {
    message: 'Hello from Cloudflare Workers',
  };
  return json(response);
};
