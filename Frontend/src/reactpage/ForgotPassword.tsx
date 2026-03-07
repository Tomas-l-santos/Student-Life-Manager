import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reset link will be sent to: ${email}`);
  };

  return (
    <div className="reset-password-wrapper">
      {/* NAVBAR */}
      <nav className="top-nav">
        <div className="nav-logo">
          <img src="/Images/student_life_logo_5.png" alt="Logo" />
          <span>Student Life</span>
        </div>
        <div className="nav-buttons">
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/" className="btn-red">
            Log in
          </Link>
          <Link to="/" className="btn-grey">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Main Split Content Area */}
      <main className="reset-page-split">
        {/* LEFT SIDE: The Form */}
        <section className="reset-form-side">
          <div className="reset-graphic-rings top-left-rings"></div>

          <div className="form-content-container">
            {/* Cleaner, stacked brand header */}
            <div className="form-brand-header">
              <img src="/Images/student_life_logo_5.png" alt="Logo" />
              <span>Student Life</span>
            </div>

            <form className="reset-form" onSubmit={handleSubmit}>
              <h2 className="serif-headline">Reset your password</h2>
              <p className="reset-description">
                Enter the email address you used when you joined and we'll send
                you instructions to get back into your account.
              </p>

              <div className="agency-form-row">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@studentlife.com"
                  className="premium-dark-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                className="pill-btn-premium continue-reset-btn"
                type="submit"
              >
                Send Reset Link <span className="arrow">→</span>
              </button>

              <div className="back-to-login">
                <Link to="/">← Back to Log in</Link>
              </div>
            </form>
          </div>
        </section>

        {/* RIGHT SIDE: Editorial Image */}
        <section className="reset-image-side">
          <div className="abstract-shape reset-teal-shape"></div>
          <div className="abstract-shape reset-yellow-shape"></div>

          <div className="reset-image-container">
            <div className="reset-mask-circle">
              <img
                src="/Images/student_life_login_background.png"
                alt="Workspace background"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;
