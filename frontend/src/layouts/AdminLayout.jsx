// src/layouts/AdminLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">🛣️ Transport Admin</div>
          <nav className="nav-links">
            <Link className={isActive("/admin") ? "active" : ""} to="/admin">Dashboard</Link>
            <Link className={isActive("/admin/vehicles") ? "active" : ""} to="/admin/vehicles">Vehicles</Link>
            <Link className={isActive("/admin/routes") ? "active" : ""} to="/admin/routes">Routes</Link>
            <Link className={isActive("/admin/bookings") ? "active" : ""} to="/admin/bookings">Bookings</Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
