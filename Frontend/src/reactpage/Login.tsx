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
        <div></div>
      </section>

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
