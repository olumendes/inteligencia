import path from "node:path";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve built SPA files
const __dirname = import.meta.dirname;
const spaPath = path.join(__dirname, "../spa");
app.use(express.static(spaPath));

// SPA fallback - serve index.html for all non-API routes
app.get("/*", (_req, res) => {
  const indexPath = path.join(spaPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: "SPA index not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
