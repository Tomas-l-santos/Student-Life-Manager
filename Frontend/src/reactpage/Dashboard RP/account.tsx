import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "./dashboard";
import { logout, getUserEmail, getUsername } from "../../services/storage";
import { deleteAccount } from "../../services/api";
import "../../styles/dashboard-css/account&security.css";

export default function Account() {
  const navigate = useNavigate();
  const [email] = useState(getUserEmail() || "student@email.com");
  const [username] = useState(getUsername() || "Student");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account and all stored data? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await deleteAccount(); // Tell the backend to wipe the JSON files
        logout(); // Clear the browser session
        navigate("/"); // Go back to login
      } catch (error: any) {
        console.error("Failed to delete account:", error);
        alert(error.message || "Failed to delete account.");
      }
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <Topbar />

      <main className="main-content account-main">
        <section className="page-header">
          <div>
            <h2>Account & Security</h2>
            <p>Manage user details, password safety, and account protection settings.</p>
          </div>
        </section>

        <section className="account-grid">
          {/* Account Information Display */}
          <div className="card account-card">
            <div className="card-header">
              <h3>Account Information</h3>
              <span className="status-badge">Active</span>
            </div>

            <div className="info-list">
              <div className="info-row">
                <span className="label">Username</span>
                <span className="value">{username}</span>
              </div>
              <div className="info-row">
                <span className="label">Email</span>
                <span className="value">{email}</span>
              </div>
              <div className="info-row">
                <span className="label">Account Type</span>
                <span className="value">Student</span>
              </div>
            </div>

            <div className="card-footer">
              <button onClick={handleLogout} className="secondary-btn logout-btn">
                Log out
              </button>
            </div>
          </div>

          <div className="security-column">
            {/* Change Password Redirect */}
            <div className="card password-card">
              <div className="card-header">
                <h3>Change Password</h3>
                <span className="mini-note">Security update</span>
              </div>

              <p className="card-desc">
                Keep your account secure by updating your password regularly. You will be redirected
                to the secure password reset page.
              </p>

              <button onClick={handleChangePassword} className="primary-btn">
                Change Password
              </button>
            </div>

            {/* Delete Account & Data Function */}
            <div className="card danger-card">
              <div className="card-header">
                <h3>Delete Account & Data</h3>
                <span className="danger-badge">Danger Zone</span>
              </div>

              <p className="danger-text">
                This action permanently removes your account details, timetable, financial data, and
                security history. Once deleted, your data cannot be recovered.
              </p>

              <button onClick={handleDeleteAccount} className="danger-btn">
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
