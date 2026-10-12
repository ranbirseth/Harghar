import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  if (!env.apiOnlyMode && env.mongoUri) {
    try {
      await connectDatabase(env.mongoUri);
    } catch (error) {
      console.error("Unable to connect to the configured local MongoDB. Server startup aborted.");
      console.error(error);
      process.exitCode = 1;
      return;
    }
  } else {
    console.warn("API_ONLY_MODE is enabled. Starting without MongoDB; database health will be disconnected.");
  }

  const server = app.listen(env.port, () => {
    console.info(`HARghAR API listening on http://localhost:${env.port} (${env.nodeEnv}).`);
  });

  const shutdown = (signal: string): void => {
    console.info(`${signal} received; shutting down.`);
    server.close(() => {
      void import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

void startServer();
