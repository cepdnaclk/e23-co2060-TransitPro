import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("adminAuth");

  return isAuth === "true" ? children : <Navigate to="/login" />;
}