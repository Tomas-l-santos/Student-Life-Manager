import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import { LoginModal, SignupModal } from "./Signup";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  img: string;
  bio: string;
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Abhishil Sinoj",
    role: "Frontend Developer",
    img: "/Images/test.png",
    bio: "Simply the best",
  },
  {
    id: 2,
    name: "Tomas Santos",
    role: "Frontend Developer",
    img: "/Images/test.png",
    bio: "?",
  },
  {
    id: 3,
    name: "Muiiz Ayodele",
    role: "Backend Architect",
    img: "/Images/test.png",
    bio: "?",
  },
  {
    id: 4,
    name: "Aamr",
    role: "Backend Architect",
    img: "/Images/test.png",
    bio: "?",
  },
];

function About() {
  const [activeOwner, setActiveOwner] = useState<TeamMember | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="agency-wrapper">
      {/* Navbar */}
      <nav className="top-nav">
        <div className="nav-logo">
          <img src="/Images/student_life_logo_5.png" alt="Logo" />
          <span>Student Life</span>
        </div>

        <div className="nav-buttons">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button className="btn-red" onClick={() => setShowLogin(true)}>
            Log in
          </button>
          <button className="btn-grey" onClick={() => setShowSignup(true)}>
            Sign up
          </button>
        </div>
      </nav>

      {/* NEW COMBINED SECTION: About Us Grid */}
      <section className="premium-about-section">
        <div className="about-grid">
          {/* Left Side: Huge Title & Mission Text */}
          <div className="about-left">
            <h1 className="huge-title">
              ABOUT
              <br />
              US
            </h1>
            <div className="about-left-text">
              <p className="subtitle-bold">Eliminating academic burnout.</p>
              <p>
                Founded in 2026 by a dedicated team of students, Student Life Management was born
                from our own struggles. We provide an elegant interface to make managing courses,
                timetables, and finances effortless.
              </p>
            </div>
          </div>

          {/* Right Side: Images & Philosophy */}
          <div className="about-right">
            <div className="about-images">
              <img
                src="/Images/student_life_login_background.png"
                alt="Workspace"
                className="main-rounded-img"
              />
              <div className="philosophy-column">
                <img
                  src="/Images/test.png"
                  alt="Students collaborating"
                  className="secondary-rounded-img"
                />
                <div className="philosophy-text">
                  <h2>Our Philosophy</h2>
                  <p>
                    Our intuitive approach means users can navigate complex study schedules with
                    ease, trusting our system to eliminate stress and foster success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="agency-team">
        <h2>Meet your team</h2>
        <p className="team-sub">
          Our experienced, friendly team help to deliver a first-class, personal service to students
          worldwide.
        </p>

        <div className="team-carousel">
          {teamData.map((owner) => (
            <div className="team-member" key={owner.id} onClick={() => setActiveOwner(owner)}>
              <div className="member-image-container">
                <div className="abstract-shape coral-blob"></div>
                <div className="member-circular-mask">
                  <img src={owner.img} alt={owner.name} />
                </div>
              </div>
              <h3>{owner.name}</h3>
              <p>{owner.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="agency-combined-footer">
        <div className="graphic-circles footer-circle-left"></div>

        <div className="footer-cta-content">
          <h2>
            Get help with your academic
            <br />
            goals and timetables
          </h2>
          <p>Find out what our intuitive platform could do for you.</p>
          <button className="pill-btn-premium" onClick={() => setShowSignup(true)}>
            Let's get started <span className="arrow">→</span>
          </button>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-links-section">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src="/Images/student_life_logo_5.png" alt="Logo" />
              <span>Student Life</span>
            </div>
            <p className="footer-tagline">
              Curating academic success for students worldwide through intuitive design and
              collaboration.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Contact</h4>
              <p>ASSA@gmail.com</p>
              <p>+44 7405615132</p>
              <p>Medway Campus</p>
            </div>
            <div className="footer-column">
              <h4>Policies</h4>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Cookie Policy</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <p>© 2026 Student Life Management. All rights reserved.</p>
        </div>
      </footer>

      {/* Team Modal */}
      {activeOwner && (
        <div className="agency-modal-overlay" onClick={() => setActiveOwner(null)}>
          <div className="agency-modal" onClick={(e) => e.stopPropagation()}>
            <button className="agency-modal-close" onClick={() => setActiveOwner(null)}>
              ✕
            </button>
            <div className="agency-modal-left">
              <div className="agency-modal-img">
                <img
                  src={activeOwner.img}
                  alt={activeOwner.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="agency-modal-right" style={{ padding: "2rem" }}>
              <h2>{activeOwner.name}</h2>
              <span
                className="agency-modal-role"
                style={{ color: "var(--color-coral)", fontWeight: "bold" }}
              >
                {activeOwner.role}
              </span>
              <div
                className="agency-modal-divider"
                style={{ height: "1px", background: "#ccc", margin: "1rem 0" }}
              ></div>
              <p>{activeOwner.bio}</p>
            </div>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

export default About;
