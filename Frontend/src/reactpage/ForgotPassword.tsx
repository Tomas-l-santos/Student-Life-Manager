import React, { useState } from "react";
<<<<<<< docs-AbishilS
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  // Step 1: Request OTP,step 2: Enter OTP & New Password,Step 3: Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setErrorMsg("Please enter your email address.");

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find account.");
      }

      setStep(2);
    } catch (error: any) {
      setErrorMsg(error.message || "Cannot connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return setErrorMsg("Please fill out all fields.");
    if (newPassword.length < 8)
      return setErrorMsg("Password must be at least 8 characters.");

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Backend strictly expects the word 'token'
          body: JSON.stringify({
            email: email,
            token: otp,
            new_password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP or request failed.");
      }

      setStep(3);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.message || "Cannot connect to server.");
    } finally {
      setIsLoading(false);
    }
=======
import { Link } from "react-router-dom";
import "../styles/styles.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reset link will be sent to: ${email}`);
>>>>>>> main
  };

  return (
    <div className="reset-password-wrapper">
<<<<<<< docs-AbishilS
      {/*Navbar*/}
=======
      {/* NAVBAR */}
>>>>>>> main
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
<<<<<<< docs-AbishilS
      <main className="reset-page-split">
        <section className="reset-form-side">
          <div className="reset-graphic-rings top-left-rings"></div>

          <div className="form-content-container">
            <div className="form-brand-header">
              <img src="/Images/student_life_logo_5.png" alt="Logo" />
              <span>Student Life</span>
            </div>

            <div className="reset-form">
              {errorMsg && (
                <div
                  style={{
                    color: "#ff6b6b",
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    marginBottom: "20px",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/*Request otp*/}
              {step === 1 && (
                <form onSubmit={handleRequestOTP}>
                  <h2 className="serif-headline">Reset your password</h2>
                  <p className="reset-description">
                    Enter the email address you used when you joined and we'll
                    send you a 6-digit OTP to get back into your account.
                  </p>

                  <div className="agency-form-row">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@studentlife.com"
                      className="premium-dark-input"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg("");
                      }}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <button
                    className="pill-btn-premium continue-reset-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Code"}{" "}
                    <span className="arrow">→</span>
                  </button>

                  <div className="back-to-login">
                    <Link to="/">← Back to Log in</Link>
                  </div>
                </form>
              )}

              {/*Enter otp */}
              {step === 2 && (
                <form onSubmit={handleResetPassword}>
                  <h2 className="serif-headline">Check your email</h2>
                  <p className="reset-description">
                    We sent a 6-digit code to <strong>{email}</strong>. Enter it
                    below along with your new password.
                  </p>

                  <div
                    className="agency-form-row"
                    style={{ marginBottom: "15px" }}
                  >
                    <label>6-Digit OTP</label>
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="premium-dark-input"
                      style={{
                        letterSpacing: "8px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                      }}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setErrorMsg("");
                      }}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="agency-form-row">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="premium-dark-input"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMsg("");
                      }}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <button
                    className="pill-btn-premium continue-reset-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}{" "}
                    <span className="arrow">→</span>
                  </button>

                  <div className="back-to-login">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#888",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: 0,
                      }}
                    >
                      ← Wrong email? Go back
                    </button>
                  </div>
                </form>
              )}
              {step === 3 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 0",
                    animation: "fadeIn 0.5s ease-out",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      margin: "0 auto 1.5rem auto",
                    }}
                  >
                    ✓
                  </div>
                  <h2
                    className="serif-headline"
                    style={{ marginBottom: "10px" }}
                  >
                    Password Updated
                  </h2>
                  <p className="reset-description">
                    Your password has been successfully reset. Redirecting you
                    back to the login page...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

=======

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
>>>>>>> main
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
<<<<<<< docs-AbishilS
=======

export default ForgotPassword;
>>>>>>> main
