import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Route,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Clock3,
  Bell,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🚌</div>
          <div>
            <h1>TransitPRO</h1>
            <p>Enterprise Admin Suite</p>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/vehicles">
            <Bus size={20} />
            <span>Vehicles</span>
          </NavLink>

          <NavLink to="/admin/routes">
            <Route size={20} />
            <span>Routes</span>
          </NavLink>

          <NavLink to="/admin/bookings">
            <ClipboardList size={20} />
            <span>Bookings</span>
          </NavLink>

          <NavLink to="/admin/manifest">
            <ClipboardCheck size={20} />
            <span>Trip Manifest</span>
          </NavLink>
        </nav>

        <button onClick={logout} className="logout-btn">
          <LogOut size={18} />
          Secure Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h2>TransitPRO Executive Control Center</h2>
            <span>Advanced transport reservation & fleet management analytics</span>
          </div>

          <div className="header-right">
            <div className="notify-box">
              <Bell size={18} />
            </div>

            <div className="live-time">
              <Clock3 size={16} />
              {time}
            </div>

            <div className="admin-user">
              <ShieldCheck size={18} />
              Administrator
            </div>
          </div>
        </header>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}