import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

function Login() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <div className="landing-wrapper">
      {/* Top Bar!! */}
      <nav className="top-nav">
        <div className="nav-logo">
          <img src="/Images/student_life_logo_5.png" alt="Logo" />
          <span>Student Life</span>
        </div>
        <div className="nav-buttons">
          <Link
            to="/about"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            About
          </Link>
          <button className="btn-red" onClick={() => setIsLoginOpen(true)}>
            Log in
          </button>
          <Link to="/create-account" className="btn-grey">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Alligning*/}
      <section className="hero-section">
        <div></div>
      </section>

      {/* Features?*/}
      <section className="feature-section bg-pink">
        <div className="feature-image">
          <img src="/Images/test.png" alt="Search" />
        </div>
        <div className="feature-text">
          <h2 style={{ color: "#c31952" }}>Timetable maybe?</h2>
          <p>Need to write something to yap about 1!!!</p>
        </div>
      </section>

      <section className="feature-section bg-teal reverse">
        <div className="feature-text">
          <h2 style={{ color: "#006b6c" }}>finance ?</h2>
          <p>Need to write something to yap about 2!!!!</p>
        </div>
        <div className="feature-image">
          <img src="/Images/test.png" alt="Collaborate" />
        </div>
      </section>

      {/* login signup  */}
      {isLoginOpen && (
        <div className="modal-overlay">
          <div className="login-card">
            <button className="close-btn" onClick={() => setIsLoginOpen(false)}>
              ✕
            </button>
            <img
              src="/Images/student_life_logo_5.png"
              alt="Logo"
              style={{ width: "60px", marginBottom: "20px" }}
            />
            <h2>Welcome to SLM ig (Need to decide on a better app name )</h2>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Email
              </label>
              <input type="email" placeholder="Email" className="pint-input" />
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="pint-input"
              />
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="rem"
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label htmlFor="rem">Remember me</label>
            </div>

            <Link to="/dashboard" className="btn-continue-modal">
              Log in
            </Link>
            <Link
              to="/forgot-password"
              style={{
                display: "block",
                marginTop: "25px",
                color: "#111",
                fontWeight: "bold",
              }}
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;
