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
    <main className="admin-shell min-h-screen">
      <aside className="sidebar">
        <Link to="/" className="admin-brand"><span className="admin-mark">H</span><span>HARghAR<small>OPERATIONS</small></span></Link>
        <div className="sidebar-rule" />
        <p className="nav-caption">WORKSPACE</p>
        <div className="nav-active"><span>▦</span> Overview</div>
        <p className="sidebar-bottom">FOUNDATION BUILD <b>PHASE 01</b></p>
      </aside>
      <section className="admin-main">
        <header className="admin-header"><span>Workspace <b>/</b> Overview</span><span className="admin-avatar">H</span></header>
        <Routes><Route path="*" element={
          <div className="dashboard">
            <div className="welcome"><p className="admin-eyebrow">BUSINESS OPERATIONS</p><h1>Admin Dashboard</h1><p>Your workspace foundation is ready. Check service connectivity below.</p></div>
            <div className="admin-title-row"><h2>System health</h2><button onClick={() => void checkStatus()} disabled={loading}>{loading ? "Checking…" : "↻ Refresh status"}</button></div>
            <div className="cards">
              <StatusCard title="Admin frontend" value="Operational" state="online" detail="Vite development server" />
              <StatusCard title="Backend API" value={loading ? "Checking…" : health ? "Connected" : "Unavailable"} state={loading ? "checking" : health ? "online" : "offline"} detail={error || (health ? `${health.application} · ${health.environment}` : "Check that the API server is running")} />
              <StatusCard title="MongoDB database" value={loading ? "Checking…" : health?.database.status === "connected" ? "Connected" : health ? "Disconnected" : "Unknown"} state={loading ? "checking" : health?.database.status === "connected" ? "online" : health ? "offline" : "unknown"} detail={health?.database.name ?? "Status reported by API"} />
            </div>
            {health && <section className="response-card"><h2>Last successful health check</h2><dl><div><dt>Application</dt><dd>{health.application}</dd></div><div><dt>Environment</dt><dd>{health.environment}</dd></div><div><dt>Checked at</dt><dd>{new Date(health.timestamp).toLocaleString()}</dd></div><div><dt>Database</dt><dd>{health.database.status}{health.database.name ? ` · ${health.database.name}` : ""}</dd></div></dl></section>}
            <p className="admin-note">Phase 1 · Setup and connectivity verification only. Business modules have not been implemented.</p>
          </div>
        } /></Routes>
      </section>
    </main>
  );
}

function StatusCard({ title, value, state, detail }: { title: string; value: string; state: "online" | "offline" | "checking" | "unknown"; detail: string }) {
  return <article className="status-card"><div className="card-heading"><span>{title}</span><i className={`admin-dot ${state}`} /></div><strong>{value}</strong><p>{detail}</p></article>;
}

export default App;
