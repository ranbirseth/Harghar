import type { Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { getDatabaseStatus } from "../config/database";

export function getHealth(_request: Request, response: Response): void {
  response.json({
    success: true,
    application: "HARghAR",
    api: "running",
    database: getDatabaseStatus(),
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
}

export function getDatabaseHealth(_request: Request, response: Response): void {
  const database = getDatabaseStatus();
  const connected = mongoose.connection.readyState === mongoose.ConnectionStates.connected;

  response.status(connected ? 200 : 503).json({
    success: connected,
    database,
    timestamp: new Date().toISOString(),
  });
}

export function getApiTest(_request: Request, response: Response): void {
  response.json({
    success: true,
    application: "HARghAR",
    message: "API communication successful.",
    timestamp: new Date().toISOString(),
  });
}
