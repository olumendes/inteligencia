import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createServer as createExpressServer } from "./server/index";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    middlewareMode: false,
    middleware: [
      // Create custom middleware to proxy API requests to Express server
      (req, res, next) => {
        if (req.url.startsWith("/api/")) {
          const expressApp = createExpressServer();
          expressApp(req, res, next);
        } else {
          next();
        }
      },
    ],
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
