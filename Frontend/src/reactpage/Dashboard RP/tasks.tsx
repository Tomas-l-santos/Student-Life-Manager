import React, { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/tasks.css";
import { getDeadlines, addDeadline, updateDeadline, deleteDeadline } from "../../services/api";

interface Task {
  id: number;
  title: string;
  due_date: string;
  priority: "low" | "normal" | "high";
  module_name: string;
  status: "To-Do" | "In Progress" | "Done";
  notes: string;
  completed: boolean;
}

export default function Tasks() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    due_date: "",
    priority: "normal",
    module_name: "",
    status: "To-Do",
    notes: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getDeadlines();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  /* This auto-save functionality was developed with assistance from Gemini (Google Gemini, 2026).
     Prompt: "make the task notes auto save after typing instead of using a save button"
     The output was reviewed, modified, and tested by the author. */
  useEffect(() => {
    if (!selectedTask) return;

    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await updateDeadline(selectedTask.id, {
          title: selectedTask.title,
          notes: selectedTask.notes,
        });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("error");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedTask]);

  // View and UI Handlers
  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setSaveStatus("idle");
  };

  const handleUpdateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedTask) {
      const updated = { ...selectedTask, notes: e.target.value };
      setSelectedTask(updated);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    }
  };

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTask) {
      const updated = { ...selectedTask, title: e.target.value };
      setSelectedTask(updated);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    }
  };

  const handleDeleteTask = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Permanently delete this task?")) {
      try {
        await deleteDeadline(id);
        setTasks(tasks.filter((t) => t.id !== id));
        if (selectedTask?.id === id) setSelectedTask(null);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  /* This kanban logic was developed with assistance from Gemini (Google Gemini, 2026).
     Prompt: "make buttons to move tasks between todo, in progress, and done"
     The output was reviewed, modified, and tested by the author. */
  const moveTaskStatus = async (e: React.MouseEvent, task: Task, newStatus: Task["status"]) => {
    e.stopPropagation();
    try {
      const isCompleted = newStatus === "Done";
      const updated = await updateDeadline(task.id, {
        status: newStatus,
        completed: isCompleted,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
      if (selectedTask?.id === task.id) {
        setSelectedTask(updated);
      }
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addDeadline({
        title: newTask.title || "Untitled Task",
        due_date: newTask.due_date || "",
        priority: newTask.priority || "normal",
        module_name: newTask.module_name || "",
        status: newTask.status || "To-Do",
        notes: newTask.notes || "",
      });

      setTasks([...tasks, created]);
      setIsModalOpen(false);
      setNewTask({
        title: "",
        due_date: "",
        priority: "normal",
        module_name: "",
        status: "To-Do",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task.");
    }
  };

  /* This component layout was developed with assistance from Gemini (Google Gemini, 2026).
     Prompt: "help me with the kanban board layout for the tasks it looks badS"
     The output was reviewed, modified, and tested by the author. */
  const renderKanbanColumn = (status: Task["status"]) => {
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
      <div className="kanban-column">
        <div className="kanban-column-header">
          <h3>{status}</h3>
          <span className="task-count">{columnTasks.length}</span>
        </div>
        <div className="kanban-cards">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${selectedTask?.id === task.id ? "active-card" : ""}`}
              onClick={() => handleOpenTask(task)}
            >
              <div className="task-card-top">
                <h4>{task.title}</h4>
              </div>

              <div className="task-card-meta">
                <span className={`task-label status-label`}>{task.status}</span>
                <span
                  className={`task-label priority-${task.priority.toLowerCase() === "normal" ? "medium" : task.priority.toLowerCase()}`}
                >
                  {task.priority === "normal"
                    ? "Medium"
                    : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              <div className="task-card-info">
                {task.due_date && (
                  <p>
                    <strong>Due:</strong>{" "}
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
                {task.module_name && (
                  <p>
                    <strong>Module:</strong> {task.module_name}
                  </p>
                )}
              </div>

              <div className="task-card-actions">
                {status === "To-Do" && (
                  <button
                    className="card-action-btn btn-move"
                    onClick={(e) => moveTaskStatus(e, task, "In Progress")}
                  >
                    Start →
                  </button>
                )}
                {status === "In Progress" && (
                  <button
                    className="card-action-btn btn-move"
                    onClick={(e) => moveTaskStatus(e, task, "Done")}
                  >
                    Complete ✓
                  </button>
                )}
                {status === "Done" && (
                  <button
                    className="card-action-btn btn-move"
                    onClick={(e) => moveTaskStatus(e, task, "In Progress")}
                  >
                    ← Reopen
                  </button>
                )}
                <button
                  className="card-action-btn btn-delete"
                  onClick={(e) => handleDeleteTask(e, task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="main-content">
        {/* Kanban Toolbar Controls */}
        <section className="tasks-toolbar">
          <div className="tasks-heading">
            <h2>Tasks Board</h2>
            <p>Organise tasks by status, due date, priority and linked module.</p>
          </div>

          <div className="tasks-toolbar-actions">
            <button
              className="task-btn"
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              + Add Task
            </button>
            <button
              className="task-btn secondary-btn"
              onClick={() => {
                const sorted = [...tasks].sort(
                  (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
                );
                setTasks(sorted);
              }}
            >
              Sort by Date
            </button>
          </div>
        </section>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              marginTop: "40px",
            }}
          >
            Loading your tasks...
          </p>
        ) : (
          <section className="tasks-layout">
            <div className="kanban-board">
              {renderKanbanColumn("To-Do")}
              {renderKanbanColumn("In Progress")}
              {renderKanbanColumn("Done")}
            </div>

            {/* Note Editor Side Panel */}
            <aside className="task-editor-panel auto-save-panel">
              {selectedTask ? (
                <div className="editor-full-layout">
                  <div className="editor-title-row">
                    <input
                      type="text"
                      className="editor-title-input massive-title"
                      value={selectedTask.title}
                      onChange={handleUpdateTitle}
                      placeholder="Task Title..."
                    />
                    <span className={`save-indicator ${saveStatus}`}>
                      {saveStatus === "saving" && "Saving..."}
                      {saveStatus === "saved" && "Saved ✓"}
                      {saveStatus === "error" && "⚠️ Error"}
                    </span>
                  </div>

                  <textarea
                    className="editor-notes-area full-bleed-textarea"
                    value={selectedTask.notes}
                    onChange={handleUpdateNotes}
                    placeholder="Start..."
                  ></textarea>
                </div>
              ) : (
                <div className="editor-empty-state">
                  <h3 style={{ margin: "0 0 8px 0", color: "var(--text)" }}>No Task Selected</h3>
                  <p style={{ margin: 0 }}>Select a task from the board to start writing notes.</p>
                </div>
              )}
            </aside>
          </section>
        )}
      </main>

      {/* Task form Modal */}
      <div
        className={`modal-overlay ${isModalOpen ? "show" : ""}`}
        style={isModalOpen ? { display: "flex" } : { display: "none" }}
        onClick={() => setIsModalOpen(false)}
      >
        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
          <div className="task-modal-header">
            <h3>Add New Task</h3>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
          </div>

          <form onSubmit={handleAddTaskSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="form-row-split">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  required
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  required
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-row-split">
              <div className="form-group">
                <label>Module Link</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={newTask.module_name}
                  onChange={(e) => setNewTask({ ...newTask, module_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  required
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value as Task["status"] })
                  }
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Task Notes (Optional)</label>
              <textarea
                rows={4}
                placeholder="Write details for this task..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              ></textarea>
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
