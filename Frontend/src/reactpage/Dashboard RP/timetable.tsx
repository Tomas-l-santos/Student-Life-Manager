/*import { useState } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/timetable.css";

export default function Timetable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [viewMode, setViewMode] = useState("WEEK");
  const [showLegend, setShowLegend] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [multiWeekEnabled, setMultiWeekEnabled] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 9));
  const [activeFilters, setActiveFilters] = useState([
    "Lecture",
    "Laboratory",
    "Seminar",
    "Tutorial",
    "Exam",
  ]);

  // Date
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return date;
  };

  const startOfWeek = getMonday(currentDate);

  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return {
      name: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d,
    };
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const emptyDaysOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getWeekNumber = (d: Date) => {
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatHeaderDateRange = () => {
    if (viewMode === "MONTH")
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    if (viewMode === "DAY")
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

    const friday = new Date(startOfWeek);
    friday.setDate(friday.getDate() + 4);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "long" })} ${String(startOfWeek.getDate()).padStart(2, "0")} - ${String(friday.getDate()).padStart(2, "0")}, ${year}`;
  };

  // hanle
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "DAY") newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === "WEEK") newDate.setDate(newDate.getDate() - 7);
    else if (viewMode === "MONTH") newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "DAY") newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === "WEEK") newDate.setDate(newDate.getDate() + 7);
    else if (viewMode === "MONTH") newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  const selectDateFromCalendar = (day: number) => {
    setCurrentDate(new Date(year, month, day));
    setShowCalendar(false);
  };

  //
  const renderHalfHourLines = () =>
    Array.from({ length: 24 }).map((_, i) => (
      <div key={i} className="half-hour-line"></div>
    ));
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];
  // time for timetable
  const renderMonthCells = () => {
    return Array.from({ length: 35 }).map((_, i) => {
      const dayNum = i - emptyDaysOffset + 1;
      const isValidDay = dayNum > 0 && dayNum <= daysInMonth;
      return (
        <div
          key={i}
          className="month-cell"
          style={{
            background: isValidDay ? "var(--panel)" : "var(--bg)",
            opacity: isValidDay ? 1 : 0.5,
          }}
        >
          <span className="month-date">{isValidDay ? dayNum : ""}</span>
        </div>
      );
    });
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Module</h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-tabs">
              <button
                className={activeTab === "manual" ? "tab active" : "tab"}
                onClick={() => setActiveTab("manual")}
              >
                Manual Entry
              </button>
              <button
                className={activeTab === "auto" ? "tab active" : "tab"}
                onClick={() => setActiveTab("auto")}
              >
                Auto-Fill (Upload)
              </button>
            </div>
            <div className="modal-body">
              {activeTab === "manual" && (
                <form
                  className="manual-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-group">
                    <label>Module Code / Title</label>
                    <input type="text" placeholder="e.g. COMP1712" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select>
                        <option>Lecture</option>
                        <option>Laboratory</option>
                        <option>Seminar</option>
                        <option>Tutorial</option>
                        <option>Exam</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Day</label>
                      <select>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input type="time" required />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input type="time" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="Building / Room" />
                  </div>
                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea placeholder="Notes..." rows={3}></textarea>
                  </div>
                  <button
                    type="submit"
                    className="submit-btn"
                    onClick={() => alert("Saved!")}
                  >
                    Save Module
                  </button>
                </form>
              )}
              {activeTab === "auto" && (
                <div className="auto-form">
                  <div className="upload-box">
                    <span className="upload-icon">📄</span>
                    <h3>Upload Timetable</h3>
                    <p>Drag & Drop file here</p>
                    <button className="browse-btn">Browse Files</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <section className="controls">
          <div className="controls-top">
            <div className="control-groups-wrapper">
              <div className="btn-group">
                <button className="btn" onClick={handleToday}>
                  TODAY
                </button>
                <button className="btn icon-btn" onClick={handlePrev}>
                  ◀
                </button>
                <button className="btn icon-btn" onClick={handleNext}>
                  ▶
                </button>
              </div>

              <div className="btn-group relative">
                <button
                  className="btn"
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{ minWidth: "200px", justifyContent: "space-between" }}
                >
                  {formatHeaderDateRange()}{" "}
                  <span style={{ fontSize: "10px" }}>▼</span>
                </button>
                <button
                  className="btn"
                  style={{ justifyContent: "space-between", gap: "8px" }}
                >
                  Week {getWeekNumber(currentDate)}{" "}
                  <span style={{ fontSize: "10px" }}>▼</span>
                </button>

                {showCalendar && (
                  <div className="calendar-popover">
                    <div className="cal-header">
                      <strong>
                        {currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>
                      <div className="cal-arrows">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() - 1);
                            setCurrentDate(d);
                          }}
                        >
                          ▲
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() + 1);
                            setCurrentDate(d);
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                    <div className="cal-grid">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                        <span key={d} className="cal-dow">
                          {d}
                        </span>
                      ))}
                      {Array.from({ length: emptyDaysOffset }).map((_, i) => (
                        <span
                          key={`empty-${i}`}
                          className="cal-day empty"
                        ></span>
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => (
                        <button
                          key={i}
                          className={`cal-day ${i + 1 === currentDate.getDate() ? "active" : ""}`}
                          onClick={() => selectDateFromCalendar(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="btn icon-btn" title="Change Timezone">
                🌍
              </button>
            </div>

            <div className="btnrow" style={{ marginLeft: "auto" }}>
              <div
                className="btn"
                onClick={() => setMultiWeekEnabled(!multiWeekEnabled)}
              >
                Multiple weeks {multiWeekEnabled ? "●" : "○"}
              </div>
              <button
                className="btn add-btn"
                onClick={() => setIsModalOpen(true)}
                style={{
                  backgroundColor: "var(--event-blue)",
                  color: "#000",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                + Add Module
              </button>
            </div>
          </div>

          <div
            className="controls-bottom"
            style={{
              justifyContent: "flex-end",
              position: "relative",
              marginTop: "16px",
            }}
          >
            <div className="segmented">
              {["DAY", "WEEK", "MONTH"].map((mode) => (
                <button
                  key={mode}
                  className={viewMode === mode ? "active" : ""}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </button>
              ))}
              <button
                className={showLegend ? "active" : ""}
                onClick={() => setShowLegend(!showLegend)}
              >
                ▤ LEGEND
              </button>
            </div>

            {showLegend && (
              <div className="legend-popover">
                {[
                  { name: "Lecture", color: "#f59e0b" },
                  { name: "Laboratory", color: "#38bdf8" },
                  { name: "Seminar", color: "#a855f7" },
                  { name: "Tutorial", color: "#22c55e" },
                  { name: "Exam", color: "#ef4444" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`legend-item ${activeFilters.includes(item.name) ? "active" : "inactive"}`}
                    onClick={() =>
                      setActiveFilters((prev) =>
                        prev.includes(item.name)
                          ? prev.filter((t) => t !== item.name)
                          : [...prev, item.name],
                      )
                    }
                  >
                    <span
                      className="color-box"
                      style={{
                        background: activeFilters.includes(item.name)
                          ? item.color
                          : "transparent",
                        border: `2px solid ${item.color}`,
                        borderRadius: "4px",
                      }}
                    ></span>
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="timetable-wrap">
          {viewMode === "WEEK" && (
            <>
              <div className="week-header">
                <div className="cell blank"></div>
                {weekDays.map((day) => (
                  <div
                    key={day.name}
                    className={`cell ${day.date === currentDate.getDate() ? "active-day" : ""}`}
                  >
                    <strong>{day.name}</strong>
                    <div>{day.date}</div>
                  </div>
                ))}
              </div>
              <div className="grid">
                <div className="time-col">
                  {timeSlots.map((time) => (
                    <div key={time} className="time-slot">
                      {time}
                    </div>
                  ))}
                </div>
                {weekDays.map((day) => (
                  <div key={day.name} className="day">
                    {renderHalfHourLines()}
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === "DAY" && (
            <>
              <div
                className="week-header"
                style={{ gridTemplateColumns: "var(--time-col-w) 1fr" }}
              >
                <div className="cell blank"></div>
                <div className="cell">
                  <strong>
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </strong>
                  <div>
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div
                className="grid"
                style={{ gridTemplateColumns: "var(--time-col-w) 1fr" }}
              >
                <div className="time-col">
                  {timeSlots.map((time) => (
                    <div key={time} className="time-slot">
                      {time}
                    </div>
                  ))}
                </div>
                <div className="day">{renderHalfHourLines()}</div>
              </div>
            </>
          )}

          {viewMode === "MONTH" && (
            <div className="month-grid">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <div key={d} className="month-header">
                  {d}
                </div>
              ))}
              {renderMonthCells()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
*/
import { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/timetable.css";
import { getTimetable, addTimetableEntry, deleteTimetableEntry } from "../../services/api";

interface TimetableEntry {
  id: number;
  module_name: string;
  location: string;
  entry_type: string;
  day: string;
  start_time: string;
  end_time: string;
}

const ENTRY_TYPE_COLORS: Record<string, string> = {
  lecture: "var(--event-blue)",
  lab: "var(--event-cyan)",
  seminar: "var(--event-purple)",
  tutorial: "var(--event-orange)",
  other: "var(--muted)",
};

const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00",
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("WEEK");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    module_name: "",
    location: "",
    entry_type: "lecture",
    day: "Monday",
    start_time: "09:00",
    end_time: "10:00",
  });

  // Load entries from backend
  useEffect(() => {
    async function load() {
      try {
        const data = await getTimetable();
        setEntries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load timetable:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Date helpers
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return date;
  };

  const startOfWeek = getMonday(currentDate);

  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return {
      name: d.toLocaleDateString("en-US", { weekday: "long" }),
      shortName: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
    };
  });

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "DAY") d.setDate(d.getDate() - 1);
    else if (viewMode === "WEEK") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "DAY") d.setDate(d.getDate() + 1);
    else if (viewMode === "WEEK") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const formatHeaderDateRange = () => {
    const friday = new Date(startOfWeek);
    friday.setDate(friday.getDate() + 4);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "long" })} ${String(startOfWeek.getDate()).padStart(2, "0")} - ${String(friday.getDate()).padStart(2, "0")}, ${currentDate.getFullYear()}`;
  };

  const getWeekNumber = (d: Date) => {
    const firstDay = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7);
  };

  // Add entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addTimetableEntry(formData);
      setEntries([...entries, created]);
      setIsModalOpen(false);
      setFormData({
        module_name: "",
        location: "",
        entry_type: "lecture",
        day: "Monday",
        start_time: "09:00",
        end_time: "10:00",
      });
    } catch (err) {
      console.error("Failed to add entry:", err);
      alert("Failed to save timetable entry.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTimetableEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  // Get entries for a specific day
  const getEntriesForDay = (dayName: string) =>
    entries.filter((e) => e.day === dayName);

  const renderHalfHourLines = () =>
    Array.from({ length: 24 }).map((_, i) => (
      <div key={i} className="half-hour-line"></div>
    ));

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Timetable Entry</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddEntry} style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="form-group">
                <label>Module Name</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={formData.module_name}
                  onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Room 401"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.entry_type}
                  onChange={(e) => setFormData({ ...formData, entry_type: e.target.value })}
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="seminar">Seminar</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                >
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn" style={{ marginTop: "8px" }}>
                Add Entry
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="main">
        {/* Controls */}
        <section className="controls">
          <div className="controls-top">
            <div className="crumb">
              <strong>MY TIMETABLE</strong>
              <span className="muted">| {formatHeaderDateRange()}</span>
              <span className="muted">| Week {getWeekNumber(currentDate)}</span>
            </div>
            <div className="btnrow">
              <div className="btn" onClick={() => setCurrentDate(new Date())}>TODAY</div>
              <div className="btn icon-btn" onClick={handlePrev}>◀</div>
              <div className="btn icon-btn" onClick={handleNext}>▶</div>
              <div className="btn" onClick={() => setIsModalOpen(true)}>+ Add Entry</div>
            </div>
          </div>

          <div className="controls-bottom">
            <div className="segmented" role="tablist">
              {["DAY","WEEK","MONTH","AGENDA"].map((m) => (
                <button
                  key={m}
                  className={viewMode === m ? "active" : ""}
                  onClick={() => setViewMode(m)}
                  role="tab"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Timetable Grid */}
        {loading ? (
          <p style={{ padding: "20px", color: "var(--muted)" }}>Loading timetable...</p>
        ) : (
          <section className="timetable-wrap">
            <div className="week-header">
              <div className="cell blank"></div>
              {weekDays.map((d) => (
                <div className="cell" key={d.name}>
                  <strong>{d.shortName}</strong>
                  <div>{d.date}</div>
                </div>
              ))}
            </div>

            <div className="grid">
              {/* Time column */}
              <div className="time-col">
                {TIME_SLOTS.map((t) => (
                  <div className="time-slot" key={t}>{t}</div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((d) => (
                <div className="day" key={d.name}>
                  {renderHalfHourLines()}
                  {getEntriesForDay(d.name).map((entry) => {
                    const startHour = parseInt(entry.start_time.split(":")[0]);
                    const startMin = parseInt(entry.start_time.split(":")[1]);
                    const endHour = parseInt(entry.end_time.split(":")[0]);
                    const endMin = parseInt(entry.end_time.split(":")[1]);
                    const topOffset = ((startHour - 8) * 60 + startMin) * (34 / 60);
                    const height = ((endHour - startHour) * 60 + (endMin - startMin)) * (34 / 60);

                    return (
                      <div
                        key={entry.id}
                        style={{
                          position: "absolute",
                          top: `${topOffset}px`,
                          height: `${height}px`,
                          left: "4px",
                          right: "4px",
                          background: ENTRY_TYPE_COLORS[entry.entry_type] || "var(--event-blue)",
                          borderRadius: "6px",
                          padding: "4px 6px",
                          fontSize: "11px",
                          color: "#fff",
                          overflow: "hidden",
                          cursor: "pointer",
                          zIndex: 1,
                        }}
                        title={`${entry.module_name} — ${entry.location}\n${entry.start_time}–${entry.end_time}`}
                        onDoubleClick={() => handleDelete(entry.id)}
                      >
                        <strong>{entry.module_name}</strong>
                        <div>{entry.location}</div>
                        <div style={{ opacity: 0.85 }}>
                          {entry.start_time}–{entry.end_time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        )}

        {entries.length > 0 && (
          <p style={{ padding: "8px 16px", fontSize: "12px", color: "var(--muted)" }}>
            Tip: Double-click an entry to delete it.
          </p>
        )}
      </main>
    </div>
  );
}