import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./reactpage/Login";
import ForgotPassword from "./reactpage/ForgotPassword";
import About from "./reactpage/about";
import Dashboard from "./reactpage/Dashboard RP/dashboard";
import Timetable from "./reactpage/Dashboard RP/timetable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
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
