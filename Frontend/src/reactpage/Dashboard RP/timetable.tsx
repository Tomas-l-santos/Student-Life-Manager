import { useState } from "react";
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
