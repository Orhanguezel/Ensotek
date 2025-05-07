import { Pinecone } from "@pinecone-database/pinecone";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// 🔄 Ortama göre .env yükle (.env.metahub, .env.clientX vs.)
const envProfile = process.env.APP_ENV || "ensotek";
const envPath = path.resolve(process.cwd(), `.env.${envProfile}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`🧠 Pinecone env loaded from ${envPath}`);
} else {
  console.warn(`⚠️ Pinecone env file not found: ${envPath}`);
}

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;

if (!apiKey) {
  throw new Error("❌ PINECONE_API_KEY is missing in your environment file.");
}

if (!indexName) {
  throw new Error("❌ PINECONE_INDEX_NAME is not set in environment variables.");
}

export const pinecone = new Pinecone({
  apiKey,
});

export const PINECONE_INDEX_NAME = indexName;
