import { Outlet, Link } from "react-router-dom";
import "../../styles/user/userLayout.css";

export default function UserLayout() {
  return (
    <>
      <header className="user-header">
        <h2 className="brand">🚍 Transport Booking</h2>

        <nav className="user-nav">
          <Link to="/">Home</Link>
          <Link to="/routes">Routes</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main className="user-content">
        <Outlet />
      </main>

      <footer className="user-footer">
        © 2025 Transport System
      </footer>
    </>
  );
}
