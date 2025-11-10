// server.mjs
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// 🔥 Catch-all pentru SPA, dar fără "*" în path:
// - ignoră /api
// - ignoră /assets
// - ignoră orice cu extensie (.js, .css, .png, etc.)
// - pentru restul (ex: /, /login, /diary) trimite index.html
app.get(/^(?!\/api)(?!\/assets)(?!.*\.[^/]+$).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Folosește alt port decât backend-ul (care e pe 3000)
const PORT = process.env.FRONTEND_PORT || 5173;

app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});
