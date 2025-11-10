import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

app.set("trust proxy", 1);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  });
