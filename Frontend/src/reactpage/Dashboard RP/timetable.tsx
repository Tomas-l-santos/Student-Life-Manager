import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/timetable.css";
import { useState, useEffect } from "react";

import { getTimetable, addTimetableEntry, deleteTimetableEntry } from "../../services/api";

interface TimetableEntry {
  id: number;
  module_name: string;
  location: string;
  entry_type: string;
  day: string;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
}

const ENTRY_TYPES: Record<string, { label: string; color: string }> = {
  lecture: { label: "Lecture", color: "#f59e0b" },
  lab: { label: "Laboratory", color: "#38bdf8" },
  seminar: { label: "Seminar", color: "#a855f7" },
  tutorial: { label: "Tutorial", color: "#22c55e" },
  other: { label: "Exam / Other", color: "#ef4444" },
};

const TIME_SLOTS = [
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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [viewMode, setViewMode] = useState("WEEK");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState(Object.keys(ENTRY_TYPES));
  const [showLegend, setShowLegend] = useState(false);

  // data range
  const todayStr = new Date().toISOString().split("T")[0];
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const endStr = threeMonthsLater.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    module_name: "",
    location: "",
    entry_type: "lecture",
    day: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    start_date: todayStr,
    end_date: endStr,
  });

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

  //  date
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
      fullDate: d,
    };
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const emptyDaysOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "DAY") d.setDate(d.getDate() - 1);
    else if (viewMode === "WEEK") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "DAY") d.setDate(d.getDate() + 1);
    else if (viewMode === "WEEK") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const formatHeaderDateRange = () => {
    if (viewMode === "MONTH")
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    const friday = new Date(startOfWeek);
    friday.setDate(friday.getDate() + 4);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "short" })} ${String(startOfWeek.getDate()).padStart(2, "0")} - ${String(friday.getDate()).padStart(2, "0")}, ${currentDate.getFullYear()}`;
  };

  const getWeekNumber = (d: Date) => {
    const firstDay = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7);
  };

  const isDateInRange = (dateToCheck: Date, startDateStr?: string, endDateStr?: string) => {
    if (!startDateStr || !endDateStr) return true;
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    return dateToCheck >= start && dateToCheck <= end;
  };

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
        start_date: todayStr,
        end_date: endStr,
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
      setSelectedEntry(null);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const renderHalfHourLines = () =>
    Array.from({ length: 24 }).map((_, i) => <div key={i} className="half-hour-line"></div>);

  const renderEntriesForDay = (dayName: string, dateToCheck: Date) => {
    return entries
      .filter(
        (e) =>
          e.day === dayName &&
          activeFilters.includes(e.entry_type) &&
          isDateInRange(dateToCheck, e.start_date, e.end_date)
      )
      .map((entry) => {
        const startHour = parseInt(entry.start_time.split(":")[0]);
        const startMin = parseInt(entry.start_time.split(":")[1]);
        const endHour = parseInt(entry.end_time.split(":")[0]);
        const endMin = parseInt(entry.end_time.split(":")[1]);

        const pxPerMinute = 68 / 60;
        const topOffset = ((startHour - 8) * 60 + startMin) * pxPerMinute;
        const height = ((endHour - startHour) * 60 + (endMin - startMin)) * pxPerMinute;

        return (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            style={{
              position: "absolute",
              top: `${topOffset}px`,
              height: `${height - 5}px`,
              left: "6px",
              right: "6px",
              background: ENTRY_TYPES[entry.entry_type]?.color || "var(--event-blue)",
              borderRadius: "8px",
              padding: "8px 10px",
              color: "#fff",
              overflow: "hidden",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.3",
            }}
          >
            <strong
              style={{
                fontSize: "13px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {entry.module_name}
            </strong>
            <span style={{ fontSize: "11px", opacity: 0.9 }}>
              {entry.start_time} - {entry.end_time}
            </span>
            <span
              style={{
                fontSize: "11px",
                opacity: 0.9,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {entry.location}
            </span>
          </div>
        );
      });
  };

  const renderMonthCells = () => {
    const totalCells = Math.ceil((daysInMonth + emptyDaysOffset) / 7) * 7;
    return Array.from({ length: totalCells }).map((_, i) => {
      const dayNum = i - emptyDaysOffset + 1;
      const isValidDay = dayNum > 0 && dayNum <= daysInMonth;

      let cellDate = new Date();
      let dayName = "";
      let dayEntries: TimetableEntry[] = [];

      if (isValidDay) {
        cellDate = new Date(year, month, dayNum);
        dayName = cellDate.toLocaleDateString("en-US", { weekday: "long" });
        dayEntries = entries.filter(
          (e) =>
            e.day === dayName &&
            activeFilters.includes(e.entry_type) &&
            isDateInRange(cellDate, e.start_date, e.end_date)
        );
      }

      return (
        <div
          key={i}
          className="month-cell"
          style={{
            background: isValidDay ? "var(--panel)" : "var(--bg)",
            border: "1px solid var(--border)",
            opacity: isValidDay ? 1 : 0.4,
            minHeight: "120px",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span
            style={{
              alignSelf: "flex-end",
              fontSize: "13px",
              fontWeight: "bold",
              color: "var(--muted)",
              marginBottom: "4px",
            }}
          >
            {isValidDay ? dayNum : ""}
          </span>
          {isValidDay &&
            dayEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  background: ENTRY_TYPES[entry.entry_type]?.color || "var(--event-blue)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              >
                {entry.start_time} - {entry.module_name}
              </div>
            ))}
        </div>
      );
    });
  };

  const handleOpenAddModal = () => {
    setFormData({
      module_name: "",
      location: "",
      entry_type: "lecture",
      day: "Monday",
      start_time: "09:00",
      end_time: "10:00",
      start_date: todayStr,
      end_date: endStr,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Timetable Entry</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form
              onSubmit={handleAddEntry}
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.entry_type}
                    onChange={(e) => setFormData({ ...formData, entry_type: e.target.value })}
                  >
                    {Object.entries(ENTRY_TYPES).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Start Date (Active From)</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date (Active Until)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
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

              <button type="submit" className="submit-btn" style={{ marginTop: "8px" }}>
                Add Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedEntry.module_name}</h2>
              <button className="close-btn" onClick={() => setSelectedEntry(null)}>
                ✕
              </button>
            </div>
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "var(--text)",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Type:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>{selectedEntry.entry_type}</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong>Location:</strong> {selectedEntry.location || "TBA"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Time:</strong> {selectedEntry.day}s, {selectedEntry.start_time} -{" "}
                {selectedEntry.end_time}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Duration:</strong> {selectedEntry.start_date || "Always"} to{" "}
                {selectedEntry.end_date || "Always"}
              </p>

              <button
                onClick={() => handleDelete(selectedEntry.id)}
                style={{
                  marginTop: "24px",
                  padding: "12px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <section className="controls">
          <div className="controls-top">
            <div className="crumb">
              <strong>MY TIMETABLE</strong>
              <span className="muted">| {formatHeaderDateRange()}</span>
              <span className="muted">| Week {getWeekNumber(currentDate)}</span>
            </div>
            <div className="btnrow">
              <div className="btn" onClick={handleToday}>
                TODAY
              </div>
              <div className="btn icon-btn" onClick={handlePrev}>
                ◀
              </div>
              <div className="btn icon-btn" onClick={handleNext}>
                ▶
              </div>
              <div
                className="btn"
                onClick={handleOpenAddModal}
                style={{
                  backgroundColor: "var(--event-blue)",
                  color: "#000",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                + Add Entry
              </div>
            </div>
          </div>

          <div
            className="controls-bottom"
            style={{ justifyContent: "flex-end", position: "relative" }}
          >
            <div className="segmented">
              {["DAY", "WEEK", "MONTH"].map((m) => (
                <button
                  key={m}
                  className={viewMode === m ? "active" : ""}
                  onClick={() => setViewMode(m)}
                >
                  {m}
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
                {Object.entries(ENTRY_TYPES).map(([key, item]) => (
                  <div
                    key={key}
                    className={`legend-item ${activeFilters.includes(key) ? "active" : "inactive"}`}
                    onClick={() =>
                      setActiveFilters((prev) =>
                        prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
                      )
                    }
                  >
                    <span
                      className="color-box"
                      style={{
                        background: activeFilters.includes(key) ? item.color : "transparent",
                        border: `2px solid ${item.color}`,
                        borderRadius: "4px",
                      }}
                    ></span>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <p style={{ padding: "20px", color: "var(--muted)" }}>Loading timetable...</p>
        ) : (
          <section className="timetable-wrap">
            {viewMode === "WEEK" && (
              <>
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
                  <div className="time-col">
                    {TIME_SLOTS.map((t) => (
                      <div className="time-slot" key={t}>
                        {t}
                      </div>
                    ))}
                  </div>
                  {weekDays.map((d) => (
                    <div className="day" key={d.name}>
                      {renderHalfHourLines()}
                      {renderEntriesForDay(d.name, d.fullDate)}
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
                <div className="grid" style={{ gridTemplateColumns: "var(--time-col-w) 1fr" }}>
                  <div className="time-col">
                    {TIME_SLOTS.map((time) => (
                      <div key={time} className="time-slot">
                        {time}
                      </div>
                    ))}
                  </div>
                  <div className="day">
                    {renderHalfHourLines()}
                    {renderEntriesForDay(
                      currentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      }),
                      currentDate
                    )}
                  </div>
                </div>
              </>
            )}

            {viewMode === "MONTH" && (
              <div className="month-grid" style={{ gap: "0" }}>
                {DAYS.concat(["Saturday", "Sunday"]).map((d) => (
                  <div
                    key={d}
                    className="month-header"
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--panel-2)",
                    }}
                  >
                    {d}
                  </div>
                ))}
                {renderMonthCells()}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
