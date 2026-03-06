import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // backend base URL
  headers: { "Content-Type": "application/json" },
});

// optional: attach token automatically if you later add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
