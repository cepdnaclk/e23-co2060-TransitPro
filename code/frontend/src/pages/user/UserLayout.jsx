import { Outlet, Link } from "react-router-dom";
import { BusFront, ShieldCheck, Bell } from "lucide-react";
import "../../styles/user/userLayout.css";

export default function UserLayout() {
  return (
    <>
      <nav className="main-navbar">
        <div className="nav-inner">

          <div className="logo">
            <div className="logo-icon">
              <BusFront size={22}/>
            </div>
            <div className="logo-text">
              <h2>TransitPRO</h2>
              <span>Smart Mobility System</span>
            </div>
          </div>

          <div className="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/routes">Routes</Link>
            <Link to="/rent">Rent Vehicle</Link>
            <Link to="/status">Booking Status</Link>
            <Link to="/smart-travel">Smart Travel</Link>
            <Link to="/notifications" className="notification-nav"><Bell size={16}/> Notifications</Link>
          </div>

          <Link to="/login" className="admin-login-btn">
            <ShieldCheck size={16}/>
            Admin Portal
          </Link>

        </div>
      </nav>

      <Outlet />
    </>
  );
}