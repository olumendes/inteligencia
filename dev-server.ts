import { createServer as createViteServer } from 'vite';
import express from 'express';
import { createServer as createExpressServer } from './server/index';

async function startDevServer() {
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

  // API routes - mount the entire Express app
  app.use(expressApp);

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`\n🚀 Dev server running at http://localhost:${port}\n`);
  });
}

startDevServer().catch((err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
