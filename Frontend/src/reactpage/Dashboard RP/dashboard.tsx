import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard-css/dashboard.css";

// side bar
export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="hamburger" aria-label="Menu" title="Menu">
          ☰
        </div>
        <div className="sidebar-title">
          <strong>Student Life Management</strong>
          <small>LIVE</small>
        </div>
      </div>

      <nav className="nav" aria-label="Primary">
        <Link
          className={location.pathname === "/dashboard" ? "active" : ""}
          to="/dashboard"
        >
          <span className="icon">📊</span> Dashboard
        </Link>
        <Link
          className={location.pathname === "/timetable" ? "active" : ""}
          to="/timetable"
        >
          <span className="icon">📅</span> Timetable
        </Link>
        <Link
          className={location.pathname === "/deadlines" ? "active" : ""}
          to="/deadlines"
        >
          <span className="icon">⏳</span> Deadlines
        </Link>
        <Link
          className={location.pathname === "/tasks" ? "active" : ""}
          to="/tasks"
        >
          <span className="icon">✅</span> Tasks
        </Link>
        <Link
          className={location.pathname === "/modules" ? "active" : ""}
          to="/modules"
        >
          <span className="icon">📚</span> Modules
        </Link>
        <Link
          className={location.pathname === "/budget" ? "active" : ""}
          to="/budget"
        >
          <span className="icon">💷</span> Budget
        </Link>
        <Link
          className={location.pathname === "/account" ? "active" : ""}
          to="/account"
        >
          <span className="icon">👤</span> Account
        </Link>
        <Link
          className={location.pathname === "/help" ? "active" : ""}
          to="/help"
        >
          <span className="icon">❓</span> Help
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="tz">
          <span>🌍</span>
          <span>Europe/London (+00:00)</span>
        </div>
        <div className="badge">v0.1 UI mock</div>
      </div>
    </aside>
  );
};

//topbar
export const Topbar = () => {
  const [theme, setTheme] = useState("original");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "original";
    setTheme(savedTheme);
    if (savedTheme === "original") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    let nextTheme = "original";
    if (theme === "original") nextTheme = "new-light";
    else if (theme === "new-light") nextTheme = "dark";
    else nextTheme = "original";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "original") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", nextTheme);
    }
  };

  const getThemeLabel = () => {
    if (theme === "original") return "🔵 Classic";
    if (theme === "new-light") return "☀️ Light";
    return "🌙 Dark";
  };

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo" title="Logo">
          SL
        </div>
        <div>
          <h1>Student Life Management</h1>
          <small>Dashboard</small>
        </div>
      </div>

      <div className="top-actions">
        <div
          className="pill"
          title="Toggle Theme"
          onClick={toggleTheme}
          style={{ width: "100px", justifyContent: "center" }}
        >
          {getThemeLabel()}
        </div>

        <div className="pill" title="Subscribe">
          SUBSCRIBE
        </div>
        <div className="pill" title="Settings">
          ⚙️
        </div>
        <div className="avatar" title="User">
          <div className="dot">U</div>
          <span>Username</span>
          <span style={{ opacity: 0.9 }}>▾</span>
        </div>
      </div>
    </header>
  );
};

// main view
export default function Dashboard() {
  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {/* Main two-column layout */}
      <section className="dash-grid">
        {/* LEFT COLUMN (bigger) */}
        <div className="dash-col dash-col-left">
          {/* Today's Timetable */}
          <article className="card">
            <header className="card-head">
              <div className="card-head-left">
                <span className="icon-circle" aria-hidden="true">
                  TT
                </span>
                <h2>Today’s Timetable</h2>
              </div>
              <Link className="card-link" to="/timetable">
                View all
              </Link>
            </header>
          </article>

          {/* Upcoming Deadlines */}
          <article className="card">
            <header className="card-head">
              <div className="card-head-left">
                <span className="icon-circle" aria-hidden="true">
                  DL
                </span>
                <h2>Upcoming Deadlines</h2>
              </div>
              <Link className="card-link" to="/deadlines">
                View all
              </Link>
            </header>
          </article>
        </div>

        {/* RIGHT COLUMN (smaller) */}
        <div className="dash-col dash-col-right">
          {/* Tasks Due Soon */}
          <article className="card">
            <header className="card-head">
              <div className="card-head-left">
                <span className="icon-circle" aria-hidden="true">
                  TS
                </span>
                <h2>Tasks Due Soon</h2>
              </div>
              <Link className="card-link" to="/tasks">
                View all
              </Link>
            </header>
          </article>

          {/* Budget Snapshot */}
          <article className="card">
            <header className="card-head">
              <div className="card-head-left">
                <span className="icon-circle" aria-hidden="true">
                  £
                </span>
                <h2>Budget Snapshot</h2>
              </div>
              <Link className="card-link" to="/budget">
                View all
              </Link>
            </header>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: "0%" }}
                aria-hidden="true"
              ></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
