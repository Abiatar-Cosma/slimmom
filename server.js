// server.js
const express = require("express");
const path = require("path");
const app = express();

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback pentru rutele client-side
app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
