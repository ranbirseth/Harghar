import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1).optional(),
  API_ONLY_MODE: z.enum(["true", "false"]).default("false"),
  CORS_ORIGINS: z.string().default(
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
  ),
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid server environment:", z.treeifyError(parsed.error));
  process.exit(1);
}

if (parsed.data.API_ONLY_MODE !== "true" && !parsed.data.MONGODB_URI) {
  console.error("MONGODB_URI is required unless API_ONLY_MODE=true.");
  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  mongoUri: parsed.data.MONGODB_URI,
  apiOnlyMode: parsed.data.API_ONLY_MODE === "true",
  corsOrigins: parsed.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
