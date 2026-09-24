import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>🚌 TransitPRO</h1>
        <h2>Transport Administration System</h2>
        <p>
          Intelligent control center for managing university routes, fleet
          vehicles, customer reservations and transport operations in one
          secure platform.
        </p>

        <div className="login-features">
          <span>✔ Fleet Monitoring</span>
          <span>✔ Route Scheduling</span>
          <span>✔ Booking Control</span>
          <span>✔ Real-Time Reports</span>
        </div>
      </div>

      <div className="login-right">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Admin Sign In</h2>
          <p>Authorized personnel only</p>

          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login to Dashboard</button>

          <small>TransitPRO Secure Access Panel © 2026</small>
        </form>
      </div>
    </div>
  );
}