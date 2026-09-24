import { useMemo, useState } from "react";
import axios from "axios";
import { Bell, BellRing, CheckCircle2, Clock3, Search, XCircle, CalendarClock, TicketCheck } from "lucide-react";
import "../../styles/user/notifications.css";

import { formatPhone, isValidPhone, normalizePhone } from "../../utils/phone";
const buildNotification = (booking) => {
  const status = booking.status || "Pending";
  const ref = booking.bookingReference || booking._id?.slice(-8).toUpperCase();
  const route = booking.route ? `${booking.route.from} → ${booking.route.to}` : booking.vehicle?.name || "Rental vehicle";

  if (status === "Approved") return {
    type: "success", icon: <CheckCircle2 />, title: "Booking confirmed",
    message: `Your reservation ${ref} for ${route} has been approved. Your seat is confirmed.`,
    meta: `Travel date: ${booking.date}`
  };
  if (status === "Completed") return {
    type: "complete", icon: <TicketCheck />, title: "Trip completed",
    message: `Your TransitPRO trip ${ref} has been marked as completed.`,
    meta: `Route: ${route}`
  };
  if (status === "Rejected" || status === "Cancelled") return {
    type: "danger", icon: <XCircle />, title: `Booking ${status.toLowerCase()}`,
    message: `Reservation ${ref} for ${route} is ${status.toLowerCase()}. Please check with the transport administrator if you need assistance.`,
    meta: `Travel date: ${booking.date}`
  };
  return {
    type: "pending", icon: <Clock3 />, title: "Booking awaiting approval",
    message: `Reservation ${ref} has been received and is waiting for administrator approval.`,
    meta: `Travel date: ${booking.date}`
  };
};

export default function Notifications() {
  const [contact, setContact] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const notifications = useMemo(() => bookings.map(buildNotification), [bookings]);
  const activeCount = notifications.filter(n => n.type === "pending" || n.type === "success").length;

  const search = async () => {
    if (!isValidPhone(contact)) { setError("Enter a valid Sri Lankan phone number with exactly 10 digits (e.g. 0712345678)."); return; }
    try {
      setLoading(true); setError("");
      const res = await axios.get(`http://localhost:5001/api/bookings/user/${encodeURIComponent(normalizePhone(contact))}`);
      setBookings(res.data || []); setSearched(true);
    } catch (err) {
      setBookings([]); setSearched(true);
      setError(err.response?.data?.error || "Unable to load notifications.");
    } finally { setLoading(false); }
  };

  return (
    <div className="notifications-page">
      <section className="notifications-hero">
        <span className="notification-eyebrow"><BellRing size={16}/> Live booking alerts</span>
        <h1>Notifications Center</h1>
        <p>Check important updates about your TransitPRO reservations, approvals and completed trips using your registered contact number.</p>
        <div className="notification-search">
          <input value={contact} onChange={e => setContact(formatPhone(e.target.value))} inputMode="numeric" maxLength={12} onKeyDown={e => e.key === "Enter" && search()} placeholder="071 234 5678" />
          <button onClick={search} disabled={loading}><Search size={16}/> {loading ? "Checking..." : "Check Notifications"}</button>
        </div>
      </section>

      {searched && (
        <section className="notification-content">
          {error && <div className="notification-error"><XCircle size={17}/> {error}</div>}
          {!error && bookings.length > 0 && <div className="notification-summary"><div><strong>{notifications.length}</strong><span>Total updates</span></div><div><strong>{activeCount}</strong><span>Actionable updates</span></div><div><CalendarClock size={20}/><span>Live from bookings</span></div></div>}
          {!error && bookings.length === 0 ? (
            <div className="notification-empty"><Bell size={42}/><h2>No notifications found</h2><p>We couldn't find reservations for this contact number.</p></div>
          ) : (
            <div className="notification-list">
              {notifications.map((n, i) => {
                const b = bookings[i];
                return <article className={`notification-card ${n.type}`} key={b._id}>
                  <div className="notification-icon">{n.icon}</div>
                  <div className="notification-body"><div className="notification-card-head"><h3>{n.title}</h3><span>{b.bookingReference || b._id?.slice(-8).toUpperCase()}</span></div><p>{n.message}</p><small>{n.meta}</small></div>
                </article>;
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
