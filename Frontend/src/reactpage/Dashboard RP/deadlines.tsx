import React, { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/deadlines.css";
import {
  getDeadlines,
  addDeadline,
  updateDeadline,
  deleteDeadline,
} from "../../services/api";

interface Deadline {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  module_name: string;
  completed: boolean;
}

export default function Deadlines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("nearest");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    due_date: "",
    priority: "",
    module_name: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    dueSoon: 0,
    overdue: 0,
    stressLabel: "Optimal",
    stressWidth: "0%",
    stressColor: "var(--event-cyan)",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getDeadlines();
        setDeadlines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load deadlines:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let overdueCount = 0;
    let dueSoonCount = 0;
    let activeDeadlines = 0;

    deadlines.forEach((d) => {
      if (d.completed) return; // Don't stress over completed tasks
      activeDeadlines++;

      const due = new Date(d.due_date);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 0) overdueCount++;
      else if (diffDays <= 3) dueSoonCount++;
    });

    let rawStress = overdueCount * 45 + dueSoonCount * 25 + activeDeadlines * 5;
    if (rawStress > 100) rawStress = 100;
    if (rawStress === 0 && activeDeadlines > 0) rawStress = 10;
    if (activeDeadlines === 0) rawStress = 0;

    let label = "Optimal";
    let color = "var(--event-cyan)";

    if (rawStress > 75) {
      label = "Critical";
      color = "#ef4444";
    } else if (rawStress > 50) {
      label = "High";
      color = "#f59e0b";
    } else if (rawStress > 20) {
      label = "Moderate";
      color = "#38bdf8";
    }

    setStats({
      total: deadlines.length,
      dueSoon: dueSoonCount,
      overdue: overdueCount,
      stressLabel: activeDeadlines === 0 ? "Relaxed" : label,
      stressWidth: `${rawStress}%`,
      stressColor: color,
    });
  }, [deadlines]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({ title: "", due_date: "", priority: "", module_name: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const target = deadlines.find((d) => d.id === id);
    if (target) {
      setFormData({
        title: target.title,
        due_date: target.due_date,
        priority: target.priority,
        module_name: target.module_name || "",
      });
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleSaveDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.due_date || !formData.priority) return;

    try {
      if (editingId !== null) {
        const updated = await updateDeadline(editingId, {
          title: formData.title,
          due_date: formData.due_date,
          priority: formData.priority.toLowerCase(),
          module_name: formData.module_name,
        });
        setDeadlines(deadlines.map((d) => (d.id === editingId ? updated : d)));
      } else {
        const created = await addDeadline({
          title: formData.title,
          due_date: formData.due_date,
          priority: formData.priority.toLowerCase(),
          module_name: formData.module_name,
        });
        setDeadlines([...deadlines, created]);
      }
    } catch (err) {
      console.error("Failed to save deadline:", err);
      alert("Failed to save deadline. Please try again.");
    }

    setFormData({ title: "", due_date: "", priority: "", module_name: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this deadline?"))
      return;
    try {
      await deleteDeadline(id);
      setDeadlines(deadlines.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete deadline:", err);
      alert("Failed to delete deadline.");
    }
  };

  const handleToggleComplete = async (id: number, current: boolean) => {
    try {
      const updated = await updateDeadline(id, { completed: !current });
      setDeadlines(deadlines.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      console.error("Failed to update deadline:", err);
    }
  };

  // --- RENDER HELPERS ---
  const getStatus = (dateString: string, completed: boolean) => {
    if (completed) return { class: "future", text: "Completed" }; // Uses green pill styling

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return { class: "overdue", text: "Overdue" };
    if (diffDays <= 3) return { class: "due-soon", text: "Due Soon" };
    return { class: "future", text: "Future" };
  };

  const priorityWeight: Record<string, number> = { high: 3, normal: 2, low: 1 };

  const filteredDeadlines = deadlines
    .filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.module_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      if (sortOrder === "priority") {
        const diff =
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        if (diff !== 0) return diff;
      }
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {/* add,edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Deadline" : "Add New Deadline"}</h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form className="deadline-form" onSubmit={handleSaveDeadline}>
                <div
                  className="form-group full-width"
                  style={{ marginBottom: "16px" }}
                >
                  <label htmlFor="title">Task Name</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter task name"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="due_date">Due Date</label>
                    <input
                      type="date"
                      id="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div
                  className="form-group full-width"
                  style={{ marginTop: "16px" }}
                >
                  <label htmlFor="module_name">Module Name (Optional)</label>
                  <input
                    type="text"
                    id="module_name"
                    placeholder="e.g. COMP1234"
                    value={formData.module_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions" style={{ marginTop: "24px" }}>
                  <button type="submit" className="deadline-btn primary-btn">
                    {editingId ? "Update Deadline" : "Save Deadline"}
                  </button>
                  <button
                    type="button"
                    className="deadline-btn secondary-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* main */}
      <main className="deadlines-main">
        <section className="deadlines-header">
          <div className="header-title-group">
            <span className="header-icon"></span>
            <div>
              <h2>Deadline Manager</h2>
              <p>
                Track assignment deadlines, manage workload, and see upcoming
                reminders.
              </p>
            </div>
          </div>

          <div className="deadlines-header-actions">
            <select
              className="sort-dropdown"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="nearest">Sort by Nearest Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button
              className="deadline-btn primary-btn"
              type="button"
              onClick={openAddModal}
            >
              + Add Deadline
            </button>
          </div>
        </section>

        {/* --- DASHBOARD CARDS --- */}
        <section className="deadline-summary">
          <div className="summary-card">
            <div className="card-top">
              <span className="summary-label">Total Deadlines</span>
              <span className="card-icon blue-icon"></span>
            </div>
            <strong className="blue-text">{stats.total}</strong>
          </div>

          <div className="summary-card">
            <div className="card-top">
              <span className="summary-label badge-label warning-badge">
                Due Soon
              </span>
              <span className="card-icon warning-icon"></span>
            </div>
            <strong className="warning-text">{stats.dueSoon}</strong>
          </div>

          <div className="summary-card">
            <div className="card-top">
              <span className="summary-label badge-label danger-badge">
                Overdue
              </span>
              <span className="card-icon danger-icon"></span>
            </div>
            <strong className="danger-text">{stats.overdue}</strong>
          </div>

          <div className="summary-card stress-card">
            <span className="summary-label">Workload / Stress</span>
            <div className="stress-visual">
              <div className="stress-bar">
                <div
                  className="stress-fill"
                  style={{
                    width: stats.stressWidth,
                    backgroundColor: stats.stressColor,
                  }}
                ></div>
              </div>
              <strong style={{ color: stats.stressColor, fontSize: "16px" }}>
                {stats.stressLabel}
              </strong>
            </div>
          </div>
        </section>

        {/* table*/}
        <section className="deadline-table-section">
          <div className="table-header-area">
            <div>
              <h3>Current Deadlines ({stats.total})</h3>
              <p>
                Sorted by{" "}
                {sortOrder === "nearest" ? "Nearest Due Date" : "Priority"}
              </p>
            </div>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <p
                style={{
                  padding: "20px",
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                Loading deadlines...
              </p>
            ) : (
              <table className="deadline-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Due Date ↕</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeadlines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        No deadlines found. Add a new task to get started!
                      </td>
                    </tr>
                  ) : (
                    filteredDeadlines.map((deadline) => {
                      const status = getStatus(
                        deadline.due_date,
                        deadline.completed,
                      );
                      const formattedDate = new Date(
                        deadline.due_date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      const uiPriorityClass =
                        deadline.priority === "normal"
                          ? "med"
                          : deadline.priority;

                      return (
                        <tr
                          key={deadline.id}
                          style={{ opacity: deadline.completed ? 0.6 : 1 }}
                        >
                          <td className="task-name-cell">
                            <strong
                              style={{
                                textDecoration: deadline.completed
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {deadline.title}
                            </strong>
                            {deadline.module_name && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted)",
                                  marginTop: "4px",
                                }}
                              >
                                {deadline.module_name}
                              </div>
                            )}
                          </td>
                          <td className="date-cell">{formattedDate}</td>
                          <td>
                            <span
                              className={`pill status-pill ${status.class}`}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`pill priority-pill ${uiPriorityClass}`}
                            >
                              {deadline.priority.charAt(0).toUpperCase() +
                                deadline.priority.slice(1)}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="icon-action-btn"
                              title={
                                deadline.completed
                                  ? "Mark incomplete"
                                  : "Mark complete"
                              }
                              onClick={() =>
                                handleToggleComplete(
                                  deadline.id,
                                  deadline.completed,
                                )
                              }
                            >
                              {deadline.completed ? "↩️" : "☑️"}
                            </button>
                            <button
                              className="icon-action-btn"
                              title="Edit"
                              onClick={() => handleEdit(deadline.id)}
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-action-btn"
                              title="Delete"
                              onClick={() => handleDelete(deadline.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
