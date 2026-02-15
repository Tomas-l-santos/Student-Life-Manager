import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

function Login() {
  return (
    <div className="page">
      <section className="left">
        <div className="logo-header">
          <div className="logo">
            <img src="/Images/student_life_logo_5.png" />
          </div>
          <div className="brand">
            <strong>Student Life Management</strong>
            <span>Sign in to continue</span>
          </div>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" placeholder="Enter email" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter Password"
            required
          />
        </div>

        <div className="row">
          <label>
            <input type="checkbox" /> Remember
          </label>
          <Link to="/forgot-password">Forgot password</Link>
        </div>

        <button className="continue-button" type="submit">
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Continue
          </Link>
        </button>
      </section>
      <section className="right">
        <img
          src="/Images/student_life_login_background.png"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </section>
    </div>
  );
}
export default Login;
