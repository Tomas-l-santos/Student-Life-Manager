import React, { useState } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/tasks.css";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  module: string;
  status: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortOrder, setSortOrder] = useState("nearest");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    priority: "",
    module: "",
  });

  const openForm = () => setIsFormOpen(true);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditTaskId(null);
    setFormData({ title: "", dueDate: "", priority: "", module: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editTaskId !== null) {
      // Update existing task
      setTasks(
        tasks.map((t) => (t.id === editTaskId ? { ...t, ...formData } : t)),
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now(),
        title: formData.title,
        dueDate: formData.dueDate,
        priority: formData.priority,
        module: formData.module,
        status: "Pending",
      };
      setTasks([...tasks, newTask]);
    }
    closeForm();
  };

  const handleEdit = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setFormData({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        module: task.module,
      });
      setEditTaskId(id);
      openForm();
    }
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleStatus = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" }
          : t,
      ),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Sorting logic
  const priorityWeight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === "priority") {
      const diff =
        (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (diff !== 0) return diff;
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

      <main className="tasks-main">
        <section className="tasks-header">
          <div>
            <h2>Task Manager</h2>
            <p>Organise tasks by due date, priority.</p>
          </div>

          <div className="tasks-header-actions">
            <select
              className="task-btn secondary-btn"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ outline: "none", cursor: "pointer" }}
            >
              <option value="nearest">Sort by Nearest Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button className="task-btn primary-btn" onClick={openForm}>
              + Add Task
            </button>
          </div>
        </section>

        {isFormOpen && (
          <section className="task-form-panel">
            <div className="task-form-top">
              <h3>{editTaskId !== null ? "Edit Task" : "Add Task"}</h3>
              <button className="close-form-btn" onClick={closeForm}>
                ✕
              </button>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

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
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="module">Module</label>
                  <input
                    type="text"
                    id="module"
                    placeholder="e.g. Software Engineering"
                    value={formData.module}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="task-btn primary-btn">
                  Save Task
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="task-list-section">
          <div className="task-list-top">
            <h3>Task List</h3>
            <div className="task-list-count">
              {tasks.length} Task{tasks.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="task-list">
            {sortedTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks added yet.</p>
              </div>
            ) : (
              sortedTasks.map((task) => {
                const priorityClass = task.priority.toLowerCase();
                const statusClass = task.status.toLowerCase();

                return (
                  <div className="task-card" key={task.id}>
                    <div className="task-card-top">
                      <div>
                        <h4>{task.title}</h4>
                        <div className="task-meta">
                          <span>
                            <strong>Due:</strong> {formatDate(task.dueDate)}
                          </span>
                          <span>
                            <strong>Module:</strong> {task.module}
                          </span>
                        </div>
                      </div>

                      <div className="task-labels">
                        <span className={`label priority-${priorityClass}`}>
                          {task.priority}
                        </span>
                        <span className={`label status-${statusClass}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="task-card-actions">
                      <button
                        className="small-btn complete-btn"
                        onClick={() => toggleStatus(task.id)}
                      >
                        {task.status === "Completed"
                          ? "Mark as Pending"
                          : "Mark as Completed"}
                      </button>
                      <button
                        className="small-btn edit-btn"
                        onClick={() => handleEdit(task.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="small-btn delete-btn"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
