export interface HealthResponse {
  success: boolean;
  application: string;
  api: string;
  database: { status: "connected" | "disconnected"; name?: string };
  environment: string;
  timestamp: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`API returned HTTP ${response.status}.`);
  return (await response.json()) as HealthResponse;
}
