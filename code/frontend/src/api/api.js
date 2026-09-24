import axios from "axios";

const configured = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/$/, "");
const baseURL = configured.endsWith("/api") ? configured : `${configured}/api`;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
