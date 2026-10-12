import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  console.error("Unhandled request error:", error);
  if (response.headersSent) {
    next(error);
    return;
  }
  response.status(500).json({ success: false, message: "An unexpected server error occurred." });
};
