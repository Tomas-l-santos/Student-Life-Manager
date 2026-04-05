import React, { useState, useMemo, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/modules.css";
import { getModules, addModule, deleteModule, addAssessment } from "../../services/api";

interface Assessment {
  id: string;
  name: string;
  assessment_type: string;
  score: number;
  max_score: number;
  weight: number;
  date: string;
}

interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  year_of_study: number;
  academic_year: string;
  deadline: string;
  assessments: Assessment[];
}

export default function Modules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [totalTargetModules, setTotalTargetModules] = useState(8);
  const [loading, setLoading] = useState(true);

  // Modal State for Assessment
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [assessmentForm, setAssessmentForm] = useState({
    name: "Coursework 1",
    assessment_type: "coursework",
    score: "",
    max_score: "100",
    weight: "100",
    date: new Date().toISOString().split("T")[0],
  });

  // Main Module Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: 15,
    year_of_study: 1,
    academic_year: "2026/2027",
    deadline: "",
  });

  // backend load
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getModules();
        setModules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load modules:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // analytics
  const getModuleAverage = (module: Module) => {
    if (!module.assessments || module.assessments.length === 0) return 0;
    let totalWeight = 0;
    let weightedScore = 0;
    module.assessments.forEach((a) => {
      totalWeight += a.weight;
      weightedScore += (a.score / a.max_score) * a.weight;
    });
    return totalWeight === 0 ? 0 : (weightedScore / totalWeight) * 100;
  };

  const stats = useMemo(() => {
    const activeModules = modules.filter((m) => m.assessments && m.assessments.length > 0);
    let totalAverages = 0;
    activeModules.forEach((m) => {
      totalAverages += getModuleAverage(m);
    });

    const currentAverage = activeModules.length > 0 ? totalAverages / activeModules.length : 0;

    // grading
    let currentClassification = "No Grades Logged";
    let classColor = "var(--tracker-muted)";

    if (activeModules.length > 0) {
      if (currentAverage >= 70) {
        currentClassification = "1st Class (Distinction)";
        classColor = "#4ade80"; // Green
      } else if (currentAverage >= 60) {
        currentClassification = "2:1 (Upper Second)";
        classColor = "#38bdf8"; // Blue
      } else if (currentAverage >= 50) {
        currentClassification = "2:2 (Lower Second)";
        classColor = "#f59e0b"; // Orange
      } else if (currentAverage >= 40) {
        currentClassification = "3rd Class (Pass)";
        classColor = "#f472b6"; // Pink
      } else {
        currentClassification = "Fail";
        classColor = "#ef4444"; // Red
      }
    }

    const remainingModules = totalTargetModules - activeModules.length;
    const distinctionTarget = 70 * totalTargetModules;
    const pointsNeeded = distinctionTarget - totalAverages;

    let neededAverageMessage = "";
    let chartFill = 0;

    if (remainingModules > 0) {
      const neededAverage = pointsNeeded / remainingModules;
      neededAverageMessage =
        neededAverage > 100
          ? "1st Class out of reach"
          : `${neededAverage.toFixed(1)}% needed for a 1st`;
      chartFill = (currentAverage / 70) * 100;
    } else {
      neededAverageMessage = "Modules Complete";
      chartFill = (currentAverage / 70) * 100;
    }

    return {
      currentAverage,
      currentClassification,
      classColor,
      remainingModules,
      neededAverageMessage,
      chartFill: Math.min(chartFill, 100),
    };
  }, [modules, totalTargetModules]);

  // handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addModule({
        name: formData.name,
        code: formData.code,
        credits: Number(formData.credits),
        year_of_study: Number(formData.year_of_study),
        academic_year: formData.academic_year,
        deadline: formData.deadline,
      });
      setModules([...modules, { ...result, assessments: [] }]);
      setFormData({ ...formData, name: "", code: "", deadline: "" });
    } catch (err: any) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  const handleAddAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleId) return;

    try {
      const result = await addAssessment({
        module_id: activeModuleId,
        name: assessmentForm.name,
        assessment_type: assessmentForm.assessment_type,
        score: Number(assessmentForm.score),
        max_score: Number(assessmentForm.max_score),
        weight: Number(assessmentForm.weight),
        date: assessmentForm.date,
      });

      setModules(
        modules.map((m) =>
          m.id === activeModuleId ? { ...m, assessments: [...(m.assessments || []), result] } : m
        )
      );
      setActiveModuleId(null);
      setAssessmentForm({ ...assessmentForm, score: "" });
    } catch (err: any) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  const handleRemoveModule = async (id: string) => {
    if (!window.confirm("Are you sure? This will delete all linked data for this module.")) return;
    try {
      await deleteModule(id);
      setModules(modules.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(`Backend Error: ${err.message}`);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="modules-main" style={{ position: "relative" }}>
        {loading ? (
          <div className="empty-state">Loading your academic profile...</div>
        ) : (
          <section className="modules-grid">
            <div className="modules-left">
              <div className="modules-card tracker-card">
                <div className="tracker-inner-gradient">
                  <div className="card-header tracker-header">
                    <div>
                      <h2>Degree Tracker</h2>
                      <p>
                        Level:{" "}
                        <strong style={{ color: stats.classColor, fontSize: "14px" }}>
                          {stats.currentClassification}
                        </strong>
                      </p>
                    </div>
                    <div className="target-select">
                      <label>Total modules for year</label>
                      <div className="custom-select-wrapper">
                        <select
                          id="targetModules"
                          value={totalTargetModules}
                          onChange={(e) => setTotalTargetModules(Number(e.target.value))}
                        >
                          {[4, 6, 8, 10].map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="chart-and-stats">
                    <div className="donut-chart-wrapper">
                      <div
                        className="donut-chart"
                        style={{
                          background: `conic-gradient(var(--donut-fill) 0% ${stats.chartFill}%, var(--donut-track) ${stats.chartFill}% 100%)`,
                        }}
                      >
                        <div className="donut-hole">
                          <strong className="donut-text">{stats.currentAverage.toFixed(1)}%</strong>
                          <span className="donut-sub">Average</span>
                        </div>
                      </div>
                    </div>
                    <div className="tracker-info">
                      <strong className="stat-hero">{stats.neededAverageMessage}</strong>
                      <span className="stat-label">
                        On remaining {stats.remainingModules} modules
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modules-card">
                <div className="card-header form-card-header">
                  <h2>Log New Module</h2>
                </div>
                <form className="module-form" onSubmit={handleAddModule}>
                  <div className="form-group">
                    <label htmlFor="name">Module Title</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="e.g. Software Engineering"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="code">Code</label>
                      <input
                        type="text"
                        id="code"
                        placeholder="e.g. COMP1234"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="credits">Credits</label>
                      <input
                        type="number"
                        id="credits"
                        value={formData.credits}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="year_of_study">Year of Study</label>
                      <select
                        id="year_of_study"
                        value={formData.year_of_study}
                        onChange={handleInputChange}
                      >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="academic_year">Academic Year</label>
                      <input
                        type="text"
                        id="academic_year"
                        value={formData.academic_year}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="deadline">Linked Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="main-btn modern-btn">
                      Create Module
                    </button>
                    <button
                      type="button"
                      className="secondary-btn modern-btn"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: "",
                          code: "",
                          deadline: "",
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="modules-right">
              <div className="modules-card full-height list-card">
                <div className="card-header list-card-header">
                  <h3>My Module Portfolio ({modules.length})</h3>
                  <p>View, track, and log weighted assessments.</p>
                </div>
                <div className="module-list">
                  {modules.length === 0 ? (
                    <div className="empty-state">
                      No modules found. Start by adding one on the left.
                    </div>
                  ) : (
                    modules.map((module) => {
                      const avg = getModuleAverage(module);
                      return (
                        <div key={module.id} className="module-item modern-module-item">
                          <div className="module-card-top-row">
                            <div className="module-title-group">
                              <h3>{module.name}</h3>
                              <span className="module-code">
                                {module.code} • Yr {module.year_of_study} • {module.credits} Credits
                              </span>
                            </div>
                            <div
                              className={`score-badge modern-score ${avg >= 70 ? "distinction" : avg === 0 ? "ungraded" : ""}`}
                              onClick={() => setActiveModuleId(module.id)}
                            >
                              {avg > 0 ? `${avg.toFixed(1)}%` : "Add Grade"} ➕
                            </div>
                          </div>
                          <div className="module-card-details-row">
                            {module.assessments &&
                              module.assessments.map((a) => (
                                <div key={a.id} className="detail-pill">
                                  {a.name}: {a.score}/{a.max_score}
                                </div>
                              ))}
                          </div>
                          <div className="module-card-details-row">
                            {module.deadline && (
                              <div className="detail-pill">
                                Due: {new Date(module.deadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="module-actions">
                            <button
                              className="delete-btn modern-delete"
                              onClick={() => handleRemoveModule(module.id)}
                            >
                              Delete Module
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
        {activeModuleId && (
          <div className="modal-overlay">
            <div className="modules-card modal-content">
              <div className="card-header">
                <h2>Log Assessment</h2>
                <p>Data is stored securely in your profile.</p>
              </div>
              <form onSubmit={handleAddAssessment} className="module-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={assessmentForm.name}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={assessmentForm.assessment_type}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          assessment_type: e.target.value,
                        })
                      }
                    >
                      <option value="coursework">Coursework</option>
                      <option value="exam">Exam</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Max Score</label>
                    <input
                      type="number"
                      value={assessmentForm.max_score}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          max_score: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (%)</label>
                    <input
                      type="number"
                      value={assessmentForm.weight}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          weight: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ color: "var(--event-cyan)" }}>Achieved Score</label>
                  <input
                    type="number"
                    value={assessmentForm.score}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        score: e.target.value,
                      })
                    }
                    autoFocus
                    required
                    style={{
                      borderColor: "var(--event-cyan)",
                      borderWidth: "2px",
                    }}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="main-btn modern-btn">
                    Save Grade
                  </button>
                  <button
                    type="button"
                    className="secondary-btn modern-btn"
                    onClick={() => setActiveModuleId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
