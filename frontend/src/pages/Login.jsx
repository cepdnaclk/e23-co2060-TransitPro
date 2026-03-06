import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password)
      return alert("Fill username and password");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      // Save login
      localStorage.setItem("loggedIn", "true");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      }

      navigate("/admin");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2 className="login-title">Admin Login</h2>

        <form onSubmit={submit}>
          <input
            className="login-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
