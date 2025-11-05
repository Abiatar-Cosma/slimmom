import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js"; // vezi app.js mai jos
import cors from "cors";

dotenv.config();

const {
  DB_HOST, // stringul tău Mongo (Atlas)
  PORT = 3000,
  CLIENT_URL = "https://Abiatar-Cosma.github.io", // front live
  DEV_CLIENT_URL = "http://localhost:5173", // vite dev
} = process.env;

// CORS trebuie să fie înainte de rute
const ALLOWED_ORIGINS = [DEV_CLIENT_URL, CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // permite și tool-uri care nu trimit Origin (ex. Postman)
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`Blocked by CORS: ${origin}`));
    },
    credentials: true, // necesar pt cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Render / alte proxy-uri: permite setarea corectă a cookie-urilor Secure
app.set("trust proxy", 1);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  });
