import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import { Product } from "../models/index.js";

const importProducts = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("🛜 Conectat la MongoDB");

    const filePath = path.join(__dirname, "products.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const total = data.length;

    const validData = data.filter(
      (item) =>
        item.categories &&
        item.weight &&
        item.title &&
        typeof item.calories === "number" &&
        Array.isArray(item.groupBloodNotAllowed)
    );

    const invalidData = data.filter(
      (item) =>
        !item.categories ||
        !item.weight ||
        !item.title ||
        typeof item.calories !== "number" ||
        !Array.isArray(item.groupBloodNotAllowed)
    );

    console.log(`📦 Total produse: ${total}`);
    console.log(`✅ Valide: ${validData.length}`);
    console.log(`⚠️ Invalide: ${invalidData.length}`);

    await Product.deleteMany();
    await Product.insertMany(validData);
    console.log("🚀 Import complet cu succes");

    const invalidPath = path.join(__dirname, "invalidProducts.json");
    fs.writeFileSync(invalidPath, JSON.stringify(invalidData, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("❌ Eroare:", err.message);
    process.exit(1);
  }
};

importProducts();
