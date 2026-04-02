import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard-css/dashboard.css";
import {
  getTimetable,
  getDeadlines,
  getTransactions,
} from "../../services/api";

// Sidebar
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

// topbar
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

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);

    if (selectedTheme === "original") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", selectedTheme);
    }
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
        <select
          className="pill theme-dropdown"
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="original">🔵 Classic</option>
          <option value="new-light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
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

// main dashboard
export default function Dashboard() {
  const [todaysClasses, setTodaysClasses] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [tasksDueSoon, setTasksDueSoon] = useState<any[]>([]);
  const [budgetSnapshot, setBudgetSnapshot] = useState({
    spent: 0,
    income: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const today = new Date();
        const todayName = today.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        // Fetch Timetable, Deadlines, and Transactions simultaneously
        const [timetableRes, deadlinesRes, transactionsRes] =
          await Promise.allSettled([
            getTimetable(),
            getDeadlines(),
            getTransactions(),
          ]);

        // Process Timetable
        if (
          timetableRes.status === "fulfilled" &&
          Array.isArray(timetableRes.value)
        ) {
          const todays = timetableRes.value
            .filter((entry) => entry.day === todayName)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
          setTodaysClasses(todays);
        }

        // Process Deadlines,3
        if (
          deadlinesRes.status === "fulfilled" &&
          Array.isArray(deadlinesRes.value)
        ) {
          const upcoming = deadlinesRes.value
            .filter((d) => !d.completed)
            .sort(
              (a, b) =>
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
            )
            .slice(0, 3);
          setUpcomingDeadlines(upcoming);
        }

        // Process Budget
        if (
          transactionsRes.status === "fulfilled" &&
          Array.isArray(transactionsRes.value)
        ) {
          const currentMonthTransactions = transactionsRes.value.filter((t) => {
            const tDate = new Date(t.transaction_date);
            return (
              tDate.getMonth() + 1 === currentMonth &&
              tDate.getFullYear() === currentYear
            );
          });

          let spent = 0;
          let income = 0;

          currentMonthTransactions.forEach((t) => {
            if (t.category?.type === "expense") spent += t.amount;
            if (t.category?.type === "income") income += t.amount;
          });

          setBudgetSnapshot({
            spent: spent,
            income: income,
            percentage: income > 0 ? (spent / income) * 100 : 0,
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <section className="dash-grid">
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

            {loading ? (
              <p
                style={{
                  padding: "10px",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                Loading classes...
              </p>
            ) : todaysClasses.length === 0 ? (
              <p
                style={{
                  padding: "10px",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                No classes today! 🎉
              </p>
            ) : (
              <ul className="list">
                {todaysClasses.map((cls) => (
                  <li className="list-item" key={cls.id}>
                    <div className="item-main">
                      <p className="item-title">{cls.module_name}</p>
                      <p className="item-meta">
                        {cls.location} • {cls.entry_type}
                      </p>
                    </div>
                    <span className="pill pill-blue">
                      {cls.start_time} - {cls.end_time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
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

            {loading ? (
              <p
                style={{
                  padding: "10px",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                Loading deadlines...
              </p>
            ) : upcomingDeadlines.length === 0 ? (
              <p
                style={{
                  padding: "10px",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                All caught up! No upcoming deadlines.
              </p>
            ) : (
              <ul className="list">
                {upcomingDeadlines.map((dl) => (
                  <li className="list-item" key={dl.id}>
                    <div className="item-main">
                      <p className="item-title">{dl.title}</p>
                      <p className="item-meta">{dl.module_name || "General"}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        className={`pill ${dl.priority === "high" ? "pill-red" : dl.priority === "normal" ? "pill-amber" : "pill-green"}`}
                      >
                        {dl.priority.toUpperCase()}
                      </span>
                      <span
                        className="pill pill-grey"
                        style={{ minWidth: "80px", textAlign: "center" }}
                      >
                        {new Date(dl.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>

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

            <ul className="list compact">
              {tasksDueSoon.length > 0 ? (
                tasksDueSoon.map((task) => (
                  <li className="list-item" key={task.id}>
                    <div className={`priority-dot prio-${task.priority}`}></div>
                    <div className="item-main">
                      <p className="item-title" style={{ fontSize: "13px" }}>
                        {task.title}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p
                  style={{
                    padding: "10px",
                    color: "var(--muted)",
                    fontSize: "13px",
                  }}
                >
                  Workspace empty.
                </p>
              )}
            </ul>
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

            <div className="budget" style={{ marginTop: "10px" }}>
              <div className="budget-row">
                <div className="budget-metric">
                  <p className="metric-label">Spent</p>
                  <p className="metric-value">
                    £{budgetSnapshot.spent.toFixed(2)}
                  </p>
                </div>
                <div className="budget-metric">
                  <p className="metric-label">Income</p>
                  <p className="metric-value">
                    £{budgetSnapshot.income.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="progress" style={{ height: "12px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(budgetSnapshot.percentage, 100)}%`,
                    background:
                      budgetSnapshot.percentage > 90
                        ? "#ef4444"
                        : budgetSnapshot.percentage > 75
                          ? "#f59e0b"
                          : "var(--primary)",
                  }}
                  aria-hidden="true"
                ></div>
              </div>
              <p
                className="budget-hint"
                style={{ textAlign: "right", marginTop: "6px" }}
              >
                {budgetSnapshot.percentage.toFixed(0)}% of income spent
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
