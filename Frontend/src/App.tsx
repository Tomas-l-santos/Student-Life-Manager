import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Login from "./reactpage/Login";
import ForgotPassword from "./reactpage/ForgotPassword";
import About from "./reactpage/about";
import Dashboard from "./reactpage/Dashboard RP/dashboard";
import Timetable from "./reactpage/Dashboard RP/timetable";
import Deadlines from "./reactpage/Dashboard RP/deadlines";
import Modules from "./reactpage/Dashboard RP/modules";
import { isLoggedIn } from "./services/storage";
import Budget from "./reactpage/Dashboard RP/budget";
import Tasks from "./reactpage/Dashboard RP/tasks";

function PrivateRoute({ children }: { children: ReactNode }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <PrivateRoute>
              <Timetable />
            </PrivateRoute>
          }
        />
        <Route
          path="/deadlines"
          element={
            <PrivateRoute>
              <Deadlines />
            </PrivateRoute>
          }
        />
        <Route
          path="/modules"
          element={
            <PrivateRoute>
              <Modules />
            </PrivateRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <Budget />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/create-account"
          element={<div>Create Account Page</div>}
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
