// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-svg-loader";

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr()],
  base: mode === "production" ? "/slimmom/" : "/",
}));
