import { Link } from "react-router-dom";
import "../styles/styles.css";

function ForgotPassword() {
  return (
    <div className="page">
      <section className="left">
        <div className="logo-row">
          <div className="logo">
            <img src="/Images/student_life_logo_5.png" />
          </div>
          <div className="brand">
            <strong>Student Life Management</strong>
            <span>Reset your password</span>
          </div>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your registered email"
          />
          <p className="helper-text">
            We will send a password reset link to this email.
          </p>
        </div>

        <button className="continue-button" type="submit">
          Send Reset Link
        </button>

        <div className="row-center">
          <Link to="/">Back to Login</Link>
        </div>
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
export default ForgotPassword;
