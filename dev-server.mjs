import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startDevServer() {
  // Dynamically import the server module (TypeScript)
  const { createServer: createExpressServer } = await import('./server/index.ts');

  // Create Express app with API routes
  const expressApp = createExpressServer();

  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  // Create a combined server
  const app = express();

  // Use Vite middleware for client files
  app.use(vite.middlewares);

  // API routes come first
  app.use('/api', (req, res, next) => {
    expressApp(req, res, next);
  });

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`\n🚀 Dev server running at http://localhost:${port}\n`);
  });
}

startDevServer().catch((err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
