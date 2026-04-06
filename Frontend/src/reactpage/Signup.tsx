import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveSession } from "../services/storage";

// Existing User Login Modal Component
export function LoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      saveSession(data.access_token, data.user.email, data.user.username);
      setIsLoggedIn(true);

      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Critical Fetch Error:", error);
      setErrorMessage("Server offline. Ensure your Flask backend is running on port 5000.");
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: "flex" }} onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
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
            <p style={{ color: "#666", fontSize: "1rem" }}>Taking you to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <img
              src="/Images/student_life_logo_5.png"
              alt="Logo"
              style={{ width: "60px", marginBottom: "20px" }}
            />
            <h2>Welcome to SLM</h2>

            {errorMessage && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "1px solid #fca5a5",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>Email</label>
              <input
                type="email"
                placeholder="Email"
                className="pint-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="pint-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
                style={{ marginBottom: "25px" }}
              />
            </div>

            <button type="submit" className="btn-continue-modal" disabled={isLoading}>
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
          </form>
        )}
      </div>
    </div>
  );
}

// New User Signup Modal Component
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

  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* This registration logic was developed with assistance from Gemini (Google Gemini, 2026).
     Prompt: "help with password strength validation for signup pop up!!"
     The output was reviewed, modified, and tested by the author. */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !email || !password || !birthdate) {
      return setErrorMessage("Please fill out all fields.");
    }
    if (password.length < 8) {
      return setErrorMessage("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      return setErrorMessage("Password must contain a capital letter.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return setErrorMessage("Password must contain a special character.");
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, birthdate }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Registration failed. Email might be in use.");
        setIsLoading(false);
        return;
      }

      saveSession(data.access_token, data.user.email, data.user.username);
      setIsRegistered(true);

      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Critical Fetch Error:", error);
      setErrorMessage("Server offline. Ensure your Flask backend is running on port 5000.");
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: "flex" }} onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
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
              Welcome to SLM, <strong>{username}</strong>.<br /> Preparing your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup}>
            <img
              src="/Images/student_life_logo_5.png"
              alt="Logo"
              style={{ width: "60px", marginBottom: "15px" }}
            />
            <h2 style={{ marginBottom: "5px" }}>Welcome to SLM</h2>
            <p style={{ color: "#333", marginBottom: "25px", fontSize: "16px" }}>
              Create your account
            </p>

            {errorMessage && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "1px solid #fca5a5",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="pint-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>Email</label>
              <input
                type="email"
                placeholder="Email"
                className="pint-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="pint-input"
                style={{ marginBottom: "5px" }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "15px",
                  marginLeft: "2px",
                }}
              >
                Passwords should be 8 characters, using upper/lowercase letters, numbers and
                symbols.
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>
                Birthdate
              </label>
              <input
                type="date"
                className="pint-input"
                value={birthdate}
                onChange={(e) => {
                  setBirthdate(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn-continue-modal"
              style={{ marginTop: "10px" }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>

            <div style={{ marginTop: "20px", fontSize: "14px", color: "#333" }}>
              Already a member?{" "}
              <button
                type="button"
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
          </form>
        )}
      </div>
    </div>
  );
}
