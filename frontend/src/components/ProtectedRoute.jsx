import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("loggedIn");  // stored after login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
