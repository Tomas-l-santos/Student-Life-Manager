import React, { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/deadlines.css";

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  description: string;
}

export default function Deadlines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("nearest");

  // Edit tracking state
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    priority: "",
    description: "",
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let overdueCount = 0;
    let dueSoonCount = 0;

    deadlines.forEach((d) => {
      const due = new Date(d.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 0) overdueCount++;
      else if (diffDays <= 3) dueSoonCount++;
    });

    let rawStress =
      overdueCount * 45 + dueSoonCount * 25 + deadlines.length * 5;
    if (rawStress > 100) rawStress = 100;
    if (rawStress === 0 && deadlines.length > 0) rawStress = 10;

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
    } else if (rawStress > 0) {
      label = "Optimal";
      color = "var(--event-cyan)";
    }

    setStats({
      total: deadlines.length,
      dueSoon: dueSoonCount,
      overdue: overdueCount,
      stressLabel: label,
      stressWidth: `${rawStress}%`,
      stressColor: color,
    });
  }, [deadlines]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Open modal for creating a NEW deadline
  const openAddModal = () => {
    setFormData({ title: "", dueDate: "", priority: "", description: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open modal for EDITING an existing deadline
  const handleEdit = (id: string) => {
    const target = deadlines.find((d) => d.id === id);
    if (target) {
      setFormData({
        title: target.title,
        dueDate: target.dueDate,
        priority: target.priority,
        description: target.description,
      });
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  // Handle both Add and Edit submissions
  const handleSaveDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate || !formData.priority) return;

    if (editingId) {
      // Update existing deadline
      setDeadlines(
        deadlines.map((d) => (d.id === editingId ? { ...d, ...formData } : d)),
      );
    } else {
      // Create new deadline
      const newDeadline: Deadline = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      setDeadlines([...deadlines, newDeadline]);
    }

    setFormData({ title: "", dueDate: "", priority: "", description: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeadlines(deadlines.filter((d) => d.id !== id));
  };

  const getStatus = (dateString: string) => {
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

  // Filter and Sort Logic
  const priorityWeight: Record<string, number> = { High: 3, Med: 2, Low: 1 };

  const filteredDeadlines = deadlines
    .filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "priority") {
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (diff !== 0) return diff;
        // Tie-breaker: nearest date wins
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        // Nearest Due Date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {/* Add/Edit Deadline Modal */}
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
                <div className="form-group full-width">
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
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
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
                      <option value="High">High</option>
                      <option value="Med">Med</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Add details..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="form-actions">
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

      {/* MAIN CONTENT */}
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

        {/* Dashboard Cards */}
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

        {/* Table Section */}
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
                    const status = getStatus(deadline.dueDate);
                    const formattedDate = new Date(
                      deadline.dueDate,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={deadline.id}>
                        <td className="task-name-cell">
                          <strong>{deadline.title}</strong>
                        </td>
                        <td className="date-cell">{formattedDate}</td>
                        <td>
                          <span className={`pill status-pill ${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`pill priority-pill ${deadline.priority.toLowerCase()}`}
                          >
                            {deadline.priority}
                          </span>
                        </td>
                        <td className="actions-cell">
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
                          <button
                            className="icon-action-btn"
                            title="Complete"
                            onClick={() => handleDelete(deadline.id)}
                          >
                            ☑️
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled>|&lt;</button>
            <button disabled>&lt;</button>
            <button className="active">1</button>
            <button disabled>&gt;</button>
            <button disabled>&gt;|</button>
          </div>
        </section>
      </main>
    </div>
  );
}
