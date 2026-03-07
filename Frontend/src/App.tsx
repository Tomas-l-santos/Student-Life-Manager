import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./reactpage/Login";
import ForgotPassword from "./reactpage/ForgotPassword";
import About from "./reactpage/about";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
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
