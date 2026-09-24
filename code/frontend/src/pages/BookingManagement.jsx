import { useEffect, useState } from "react";
import { Trash2, CheckCircle2, XCircle, CheckCheck, ClipboardList, Phone, MapPin, RefreshCw } from "lucide-react";
import api from "../api/api";
import "../styles/BookingManagement.css";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");

  const loadBookings = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load bookings.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setBusyId(id); setError(""); setMessage("");
      await api.patch(`/bookings/${id}/status`, { status });
      setMessage(`Booking ${status.toLowerCase()} successfully.`);
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update booking status.");
    } finally { setBusyId(""); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this reservation permanently?")) return;
    try {
      setBusyId(id);
      await api.delete(`/bookings/${id}`);
      setMessage("Booking deleted successfully.");
      await loadBookings();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete booking.");
    } finally { setBusyId(""); }
  };

  const seatLabel = (b) => b.seatNumbers?.length ? b.seatNumbers.join(", ") : String(b.seats || "-");
  const filteredBookings = genderFilter === "All"
    ? bookings
    : bookings.filter((b) => b.gender === genderFilter);
  const maleCount = bookings.filter((b) => b.gender === "Male").length;
  const femaleCount = bookings.filter((b) => b.gender === "Female").length;
  const seatNumbersForGender = (gender) => bookings
    .filter((b) => b.gender === gender)
    .flatMap((b) => b.seatNumbers?.length ? b.seatNumbers.map(Number) : [])
    .filter(Number.isInteger)
    .sort((a, z) => a - z);
  const maleSeats = seatNumbersForGender("Male");
  const femaleSeats = seatNumbersForGender("Female");

  return (
    <div className="booking-wrapper">
      <div className="booking-title-box">
        <div className="booking-title-row">
          <div>
            <h1>Executive Booking Control Center</h1>
            <p>Review customer reservations, approve confirmed passengers and manage trip operations.</p>
          </div>
          <button className="refresh-bookings-btn" onClick={loadBookings} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {message && <div className="booking-alert success">{message}</div>}
      {error && <div className="booking-alert error">{error}</div>}

      <div className="booking-table-card">
        <div className="booking-head"><ClipboardList size={20} /> Live Reservation Requests</div>
        <div className="gender-summary-bar">
          <button className={`gender-filter all ${genderFilter === "All" ? "active" : ""}`} onClick={() => setGenderFilter("All")}>All <strong>{bookings.length}</strong></button>
          <button className={`gender-filter male ${genderFilter === "Male" ? "active" : ""}`} onClick={() => setGenderFilter("Male")}>Male <strong>{maleCount}</strong></button>
          <button className={`gender-filter female ${genderFilter === "Female" ? "active" : ""}`} onClick={() => setGenderFilter("Female")}>Female <strong>{femaleCount}</strong></button>
        </div>
        <div className="gender-seat-summary">
          <div className="gender-seat-card male-card">
            <div><span className="gender-seat-title">Male</span><strong>{maleSeats.length}</strong><small> seats booked</small></div>
            <p>{maleSeats.length ? `Seat ${maleSeats.join(", ")}` : "No male seats booked"}</p>
          </div>
          <div className="gender-seat-card female-card">
            <div><span className="gender-seat-title">Female</span><strong>{femaleSeats.length}</strong><small> seats booked</small></div>
            <p>{femaleSeats.length ? `Seat ${femaleSeats.join(", ")}` : "No female seats booked"}</p>
          </div>
        </div>
        <div className="booking-table-scroll">
          <table>
            <thead><tr>
              <th>Reference</th><th>Customer</th><th>Gender</th><th>Contact</th><th>Trip / Vehicle</th><th>Date</th>
              <th>Seat Number</th><th>Pickup</th><th>Type</th><th>Status</th><th>Approve</th><th>Reject</th><th>Complete</th><th>Delete</th>
            </tr></thead>
            <tbody>
              {!loading && filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.bookingReference || b._id.slice(-8).toUpperCase()}</strong></td>
                  <td>{b.customerName}</td>
                  <td><span className={`gender-badge ${(b.gender || "unknown").toLowerCase()}`}>{b.gender || "N/A"}</span></td>
                  <td><div className="contact-box"><Phone size={14} />{b.contact || "N/A"}</div></td>
                  <td>{b.route ? `${b.route.from} → ${b.route.to}` : b.vehicle?.name || "Rental"}</td>
                  <td>{b.date}</td><td>{seatLabel(b)}</td>
                  <td><div className="pickup-box"><MapPin size={14} />{b.pickupLocation || "N/A"}</div></td>
                  <td>{b.bookingType}</td>
                  <td><span className={`booking-status ${(b.status || "Pending").toLowerCase()}`}>{b.status || "Pending"}</span></td>
                  <td><button className="approve-btn" disabled={busyId === b._id || ["Approved","Completed","Rejected","Cancelled"].includes(b.status)} title="Approve booking" onClick={() => updateStatus(b._id, "Approved")}><CheckCircle2 size={16} /></button></td>
                  <td><button className="reject-btn" disabled={busyId === b._id || ["Rejected","Completed","Cancelled"].includes(b.status)} title="Reject booking" onClick={() => updateStatus(b._id, "Rejected")}><XCircle size={16} /></button></td>
                  <td><button className="approve-btn" disabled={busyId === b._id || b.status !== "Approved"} title="Mark completed" onClick={() => updateStatus(b._id, "Completed")}><CheckCheck size={16} /></button></td>
                  <td><button className="delete-btn" disabled={busyId === b._id} onClick={() => deleteBooking(b._id)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
              {loading && <tr><td colSpan="14" className="booking-empty">Loading bookings…</td></tr>}
              {!loading && !filteredBookings.length && <tr><td colSpan="14" className="booking-empty">No bookings match the selected category.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
