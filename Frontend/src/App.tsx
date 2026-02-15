import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./reactpage/Login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
        <Route
          path="/create-account"
          element={<div>Create Account Page</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
