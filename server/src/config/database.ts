import mongoose from "mongoose";

export async function connectDatabase(uri: string): Promise<void> {
  mongoose.connection.on("connected", () => {
    console.info(`MongoDB connected${mongoose.connection.name ? `: ${mongoose.connection.name}` : ""}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected; Mongoose will attempt to reconnect.");
  });
  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected.");
  });
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

export function getDatabaseStatus(): { status: "connected" | "disconnected"; name?: string } {
  if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
    return { status: "disconnected" };
  }

  const name = mongoose.connection.db?.databaseName;
  return name ? { status: "connected", name } : { status: "connected" };
}
