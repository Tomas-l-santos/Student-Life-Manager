import React, { useState } from "react";
import { Link } from "react-router-dom";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return setErrorField("email");
    if (!password) return setErrorField("password");

    setErrorField(null);
    alert("Login successful!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
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
              placeholder="Password"
              className="pint-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorField(null);
              }}
            />
            {errorField === "password" && (
              <div className="custom-error-tooltip">
                <span className="tooltip-icon">!</span> Please fill out this
                field.
              </div>
            )}
          </div>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="rem" />
          <label htmlFor="rem">Remember me</label>
        </div>

        <button onClick={handleLogin} className="btn-continue-modal">
          Log in
        </button>
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
  );
}

export function SignupModal({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      return setErrorField("email");
    }
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

    setErrorField(null);
    alert("Signup successful!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <img
          src="/Images/student_life_logo_5.png"
          alt="Logo"
          style={{ width: "60px", marginBottom: "15px" }}
        />
        <h2 style={{ marginBottom: "5px" }}>Welcome to SLM</h2>
        <p style={{ color: "#333", marginBottom: "25px", fontSize: "16px" }}>
          Create your account
        </p>

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
            passwords should be 8 characters,using upper/lowercase
            letters,numbers and symbols.
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <label
            style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}
          >
            Birthdate
          </label>
          <input type="date" className="pint-input" />
        </div>

        <button
          onClick={handleSignup}
          className="btn-continue-modal"
          style={{ marginTop: "10px" }}
        >
          Continue
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
      </div>
    </div>
  );
}
