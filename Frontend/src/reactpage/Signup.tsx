import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveSession } from "../services/storage";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);

  // Restored missing states
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setLoginErrorMsg("Please enter your email.");
      return setErrorField("email");
    }
    if (!password) {
      setLoginErrorMsg("Please enter your password.");
      return setErrorField("password");
    }

    setErrorField(null);
    setIsLoading(true);

    try {
      // Restored backend connection
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginErrorMsg(data.error || "Invalid email or password.");
        setErrorField("password");
        return;
      }

      // Success state and routing
      saveSession(data.access_token, data.user.email, data.user.username);
      setIsLoggedIn(true);
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setLoginErrorMsg("Cannot connect to server.");
      setErrorField("password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {isLoggedIn ? (
          <div className="premium-success-card">
            <div className="success-badge">✓</div>
            <h3
              style={{
                color: "#1a1a1a",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Welcome Back!
            </h3>
            <p style={{ color: "#666", fontSize: "1rem" }}>
              Taking you to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <img
              src="/Images/student_life_logo_5.png"
              alt="Logo"
              style={{ width: "60px", marginBottom: "20px" }}
            />
            <h2>Welcome to SLM</h2>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Email
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  className="pint-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "email" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> {loginErrorMsg}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Password"
                  className="pint-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "password" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> {loginErrorMsg}
                  </div>
                )}
              </div>
            </div>

            <div className="checkbox-row">
              <input type="checkbox" id="rem" />
              <label htmlFor="rem">Remember me</label>
            </div>

            <button
              onClick={handleLogin}
              className="btn-continue-modal"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
            <Link
              to="/forgot-password"
              onClick={onClose}
              style={{
                display: "block",
                marginTop: "25px",
                color: "#111",
                fontWeight: "bold",
              }}
            >
              Forgot your password?
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function SignupModal({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username) return setErrorField("username");
    if (!email) return setErrorField("email");
    if (!password) {
      setPasswordErrorMsg("Please fill out this field.");
      return setErrorField("password");
    }
    if (password.length < 8) {
      setPasswordErrorMsg("Must be at least 8 characters.");
      return setErrorField("password");
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordErrorMsg("Must contain a capital letter.");
      return setErrorField("password");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordErrorMsg("Must contain a special character.");
      return setErrorField("password");
    }
    if (!birthdate) {
      setPasswordErrorMsg("Please select your birthdate.");
      return setErrorField("birthdate");
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, birthdate }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordErrorMsg(data.error || "Registration failed");
        setErrorField("password");
        return;
      }

      setErrorField(null);
      saveSession(data.access_token, data.user.email, data.user.username);

      setIsRegistered(true);
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setPasswordErrorMsg("Cannot connect to server.");
      setErrorField("password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {isRegistered ? (
          <div className="premium-success-card">
            <div className="success-badge">✓</div>
            <h3
              style={{
                color: "#1a1a1a",
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Account Created!
            </h3>
            <p style={{ color: "#666", fontSize: "1rem" }}>
              Welcome to SLM, <strong>{username}</strong>.<br />
              Preparing your dashboard...
            </p>
          </div>
        ) : (
          <>
            <img
              src="/Images/student_life_logo_5.png"
              alt="Logo"
              style={{ width: "60px", marginBottom: "15px" }}
            />
            <h2 style={{ marginBottom: "5px" }}>Welcome to SLM</h2>
            <p
              style={{ color: "#333", marginBottom: "25px", fontSize: "16px" }}
            >
              Create your account
            </p>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="pint-input"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "username" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> Please fill out this
                    field.
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Email
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  className="pint-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "email" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> Please fill out this
                    field.
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Create a password"
                  className="pint-input"
                  style={{ marginBottom: "5px" }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "password" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> {passwordErrorMsg}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "15px",
                  marginLeft: "2px",
                }}
              >
                Passwords should be 8 characters, using upper/lowercase letters,
                numbers and symbols.
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
              >
                Birthdate
              </label>
              <div className="input-wrapper">
                <input
                  type="date"
                  className="pint-input"
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                    setErrorField(null);
                  }}
                  disabled={isLoading}
                />
                {errorField === "birthdate" && (
                  <div className="custom-error-tooltip">
                    <span className="tooltip-icon">!</span> {passwordErrorMsg}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSignup}
              className="btn-continue-modal"
              style={{ marginTop: "10px" }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>

            <div style={{ marginTop: "20px", fontSize: "14px", color: "#333" }}>
              Already a member?{" "}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#111",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                Log in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
