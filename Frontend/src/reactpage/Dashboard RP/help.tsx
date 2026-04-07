import { Sidebar, Topbar } from "./dashboard";
import "../../styles/dashboard-css/help.css";

export default function Help() {
  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="main-content">
        {/* CSS Grid for Help content */}
        <section className="help-grid">
          {/* Overview Card */}
          <div className="card help-overview">
            <div className="card-header">
              <h2>Help Overview</h2>
              <span className="card-tag">Guide</span>
            </div>
            <p>
              Welcome to the Student Life Management help page. This area gives an overview of how
              the system works and where to find the most important features.
            </p>
            <p>
              Use the sections below for instructions, common questions, troubleshooting advice,
              quick navigation, and support details.
            </p>
          </div>

          {/* Instructions Card */}
          <div className="card instructions">
            <div className="card-header">
              <h2>Instructions for Using System Features</h2>
              <span className="card-tag">Steps</span>
            </div>
            <ul className="help-list">
              <li>
                <strong>Dashboard:</strong> View a summary of important updates and system
                information.
              </li>
              <li>
                <strong>Timetable:</strong> Organise lectures, study sessions, and class planning.
              </li>
              <li>
                <strong>Deadlines:</strong> Keep track of assignment due dates and reminders.
              </li>
              <li>
                <strong>Tasks:</strong> Add personal tasks and mark progress when completed.
              </li>
              <li>
                <strong>Modules:</strong> Manage module details and academic information.
              </li>
              <li>
                <strong>Budget:</strong> Record expenses and check spending activity.
              </li>
              <li>
                <strong>Account:</strong> Review user account details and profile settings.
              </li>
            </ul>
          </div>

          {/* FAQ Card */}
          <div className="card faq">
            <div className="card-header">
              <h2>FAQ</h2>
              <span className="card-tag">Common</span>
            </div>

            <div className="faq-item">
              <h3>How do I add a new task?</h3>
              <p>Open the Tasks page and use the task creation area to add a new item.</p>
            </div>

            <div className="faq-item">
              <h3>Where can I check assignment dates?</h3>
              <p>Open the Deadlines page to view due dates and planned reminders.</p>
            </div>

            <div className="faq-item">
              <h3>How do I manage modules?</h3>
              <p>Go to the Modules page to review, add, or organise module information.</p>
            </div>

            <div className="faq-item">
              <h3>Where can I update account information?</h3>
              <p>Use the Account page to review account and user-related settings.</p>
            </div>
          </div>

          {/* Troubleshooting Card */}
          <div className="card troubleshooting">
            <div className="card-header">
              <h2>Troubleshooting</h2>
              <span className="card-tag">Fixes</span>
            </div>
            <ul className="help-list">
              <li>If the page does not load properly, refresh the browser.</li>
              <li>
                If saved information is missing, check that the correct page was used before
                closing.
              </li>
              <li>If buttons do not respond, reload the page and try again.</li>
              <li>If navigation does not work, use the quick links section below.</li>
              <li>
                If a problem continues, use the support placeholder for future contact options.
              </li>
            </ul>
          </div>

          {/* Quick Links Card */}
          <div className="card quick-links">
            <div className="card-header">
              <h2>Quick Links to Other Pages</h2>
              <span className="card-tag">Links</span>
            </div>
            <div className="quick-links-grid">
              <a href="/dashboard" className="quick-link-box">
                📊 Dashboard
              </a>
              <a href="/timetable" className="quick-link-box">
                📅 Timetable
              </a>
              <a href="/deadlines" className="quick-link-box">
                ⏳ Deadlines
              </a>
              <a href="/tasks" className="quick-link-box">
                ✅ Tasks
              </a>
              <a href="/modules" className="quick-link-box">
                📚 Modules
              </a>
              <a href="/budget" className="quick-link-box">
                💷 Budget
              </a>
              <a href="/account" className="quick-link-box">
                👤 Account
              </a>
              <a href="/help" className="quick-link-box">
                ❓ Help
              </a>
            </div>
          </div>

          {/* Contact Support Card */}
          <div className="card contact-support">
            <div className="card-header">
              <h2>Contact / Support Placeholder</h2>
              <span className="card-tag">Support</span>
            </div>
            <p>
              <strong>Email:</strong> support@studentlife.local
            </p>
            <p>
              <strong>Phone:</strong> +44 0000 000000
            </p>
            <p>
              <strong>Hours:</strong> Monday to Friday, 9:00 AM – 5:00 PM
            </p>
            <p>
              This is a placeholder support section that can later be connected to real support
              details or a help request form.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
