import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import { LoginModal, SignupModal } from "./Signup";

function Login() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="landing-wrapper">
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
          <button className="btn-grey" onClick={() => setIsSignUpOpen(true)}>
            Sign up
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your ultimate <span className="hero-accent">student life</span> manager.
          </h1>
          <p className="hero-subtitle">
            Organize your timetable, track your finances, and stay on top of your coursework — all
            in one seamless dashboard.
          </p>
          <button className="btn-red hero-cta" onClick={() => setIsSignUpOpen(true)}>
            Start for free
          </button>
        </div>
        <div className="hero-image-container">
          <div className="hero-card hero-card--main">
            <img
              src="/Images/student_life_login_background.png"
              alt="Student Dashboard"
              className="hero-image"
            />
          </div>
          <div className="hero-card hero-card--secondary">
            <img
              src="/Images/student_life_login_background.png"
              alt="Dashboard detail"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <div className="features-intro">
        <h2 className="features-intro__title">Bring your student life together</h2>
        <p className="features-intro__sub">
          Student Life gives you the tools to stay organised, save money, and never fall behind on
          coursework.
        </p>
      </div>

      <section className="feature-section">
        <div className="feature-card-wrap feature-card-wrap--pink">
          <div className="feature-card">
            <img src="/Images/test.png" alt="Timetable preview" />
          </div>
        </div>
        <div className="feature-text">
          <h2 className="feature-text__title" style={{ color: "#c31952" }}>
            Never miss a lecture again
          </h2>
          <p className="feature-text__body">
            Sync your classes, deadlines, and assignments in one clean timetable. Get ahead, not
            stressed.
          </p>
          <button className="btn-feature btn-feature--red" onClick={() => setIsSignUpOpen(true)}>
            Join Student Life
          </button>
        </div>
      </section>

      <section className="feature-section feature-section--reverse">
        <div className="feature-text">
          <h2 className="feature-text__title" style={{ color: "#006b6c" }}>
            Take control of your money
          </h2>
          <p className="feature-text__body">
            Track spending, manage your student loan, and hit your savings goals without the
            spreadsheet headache.
          </p>
          <button className="btn-feature btn-feature--teal" onClick={() => setIsSignUpOpen(true)}>
            Join Student Life
          </button>
        </div>
        <div className="feature-card-wrap feature-card-wrap--teal">
          <div className="feature-card">
            <img src="/Images/test.png" alt="Finance tracker preview" />
          </div>
        </div>
      </section>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}

      {isSignUpOpen && (
        <SignupModal
          onClose={() => setIsSignUpOpen(false)}
          onSwitchToLogin={() => setIsLoginOpen(true)}
        />
      )}
    </div>
  );
}

export default Login;
