import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Login from "./reactpage/Login";
import ForgotPassword from "./reactpage/ForgotPassword";
import About from "./reactpage/about";
import Dashboard from "./reactpage/Dashboard RP/dashboard";
import Timetable from "./reactpage/Dashboard RP/timetable";
import Deadlines from "./reactpage/Dashboard RP/deadlines";
import { isLoggedIn } from "./services/storage";

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
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/timetable"
          element={<PrivateRoute><Timetable /></PrivateRoute>}
        />
        <Route
          path="/deadlines"
          element={<PrivateRoute><Deadlines /></PrivateRoute>}
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
