import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { fetchHealth, type HealthResponse } from "./api/health";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setHealth(await fetchHealth());
    } catch (cause) {
      setHealth(null);
      setError(cause instanceof Error ? cause.message : "The API could not be reached.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  return (
    <main className="page-shell min-h-screen">
      <nav className="topbar">
        <Link to="/" className="brand"><span className="brand-mark">h</span> HARghAR</Link>
        <span className="nav-label">A better way to shop local</span>
      </nav>
      <Routes>
        <Route path="*" element={
          <section className="hero">
            <p className="eyebrow">YOUR NEIGHBOURHOOD, DELIVERED</p>
            <h1>Good things,<br /><span>closer to home.</span></h1>
            <p className="intro">A thoughtful local shopping experience is on its way. We’re getting everything ready behind the scenes.</p>
            <section className="status-panel" aria-live="polite">
              <div className="panel-heading"><div><p className="eyebrow">SYSTEM CHECK</p><h2>Service status</h2></div>
                <button className="refresh-button" onClick={() => void checkStatus()} disabled={loading}>{loading ? "Checking…" : "↻ Check status"}</button>
              </div>
              <StatusRow label="Customer web" state="online" />
              <StatusRow label="Backend API" state={loading ? "checking" : health ? "online" : "offline"} detail={error} />
              <StatusRow label="MongoDB" state={loading ? "checking" : health?.database.status === "connected" ? "online" : health ? "offline" : "unknown"} detail={health?.database.name} />
              {health && <p className="last-check">Last checked {new Date(health.timestamp).toLocaleTimeString()}</p>}
            </section>
            <footer>Made for local, made for you. <span>© HARghAR</span></footer>
          </section>
        } />
      </Routes>
    </main>
  );
}

function StatusRow({ label, state, detail }: { label: string; state: "online" | "offline" | "checking" | "unknown"; detail?: string }) {
  const labels = { online: "Operational", offline: "Unavailable", checking: "Checking…", unknown: "Unknown" };
  return <div className="status-row"><span className="status-label"><i className={`dot ${state}`} />{label}</span><span className="status-value">{detail || labels[state]}</span></div>;
}

export default App;
