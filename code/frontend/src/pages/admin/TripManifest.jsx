import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { BusFront, CalendarDays, ClipboardList, Download, Phone, Printer, Users, RefreshCw } from "lucide-react";
import api from "../../api/api";
import "../../styles/TripManifest.css";

export default function TripManifest() {
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [date, setDate] = useState("");
  const [includePending, setIncludePending] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/routes").then((r) => setRoutes(r.data)).catch(() => setError("Unable to load routes."));
  }, []);

  const load = async () => {
    try {
      setLoading(true); setError("");
      const params = new URLSearchParams();
      if (routeId) params.set("routeId", routeId);
      if (date) params.set("date", date);
      if (includePending) params.set("includePending", "true");
      const res = await api.get(`/bookings/manifest?${params.toString()}`);
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to generate manifest.");
    } finally { setLoading(false); }
  };

  const stats = useMemo(() => {
    const passengers = bookings.reduce((sum, b) => sum + Number(b.seats || 0), 0);
    const vehicle = bookings[0]?.vehicle;
    const capacity = routeId ? Number(vehicle?.seats || 0) : 0;
    return { passengers, capacity, available: capacity ? Math.max(capacity - passengers, 0) : null, occupancy: capacity ? Math.round((passengers / capacity) * 100) : null, vehicle, route: bookings[0]?.route };
  }, [bookings]);

  const seatLabel = (b) => b.seatNumbers?.length ? b.seatNumbers.join(", ") : String(b.seats || "-");
  const maleCount = bookings.filter((b) => b.gender === "Male").reduce((sum, b) => sum + Number(b.seats || 0), 0);
  const femaleCount = bookings.filter((b) => b.gender === "Female").reduce((sum, b) => sum + Number(b.seats || 0), 0);
  const seatsForGender = (gender) => bookings
    .filter((b) => b.gender === gender)
    .flatMap((b) => b.seatNumbers?.length ? b.seatNumbers.map(Number) : [])
    .filter(Number.isInteger)
    .sort((a, z) => a - z);
  const maleSeats = seatsForGender("Male");
  const femaleSeats = seatsForGender("Female");

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("TransitPRO Trip Passenger Manifest", 15, 18);
    doc.setFontSize(10);
    doc.text(`Route: ${stats.route ? `${stats.route.from} -> ${stats.route.to}` : "All routes"}`, 15, 27);
    doc.text(`Date: ${date || "All dates"}`, 15, 33);
    doc.text(`Passengers: ${stats.passengers}${stats.capacity ? ` / ${stats.capacity}` : ""} | Male: ${maleCount} | Female: ${femaleCount}`, 15, 39);
    let y = 50;
    bookings.forEach((b, i) => {
      const line = `${i + 1}. ${b.customerName} | ${b.gender || "N/A"} | ${b.contact || "N/A"} | Seat: ${seatLabel(b)} | ${b.pickupLocation || "N/A"} | ${b.status}`;
      const wrapped = doc.splitTextToSize(line, 180);
      doc.text(wrapped, 15, y); y += wrapped.length * 6 + 2;
      if (y > 275) { doc.addPage(); y = 18; }
    });
    doc.save(`TransitPRO_Manifest_${date || "all"}.pdf`);
  };

  return <div className="manifest-page">
    <div className="manifest-hero"><span><ClipboardList size={16}/> Operations center</span><h1>Trip Passenger Manifest</h1><p>Generate a confirmed passenger list for a route and travel date. Only approved/completed bookings are included by default.</p></div>
    <div className="manifest-filters">
      <label><BusFront size={17}/> Route<select value={routeId} onChange={e => setRouteId(e.target.value)}><option value="">All routes</option>{routes.map(r => <option key={r._id} value={r._id}>{r.from} → {r.to}</option>)}</select></label>
      <label><CalendarDays size={17}/> Travel date<input type="date" value={date} onChange={e => setDate(e.target.value)}/></label>
      <label className="manifest-check"><input type="checkbox" checked={includePending} onChange={e => setIncludePending(e.target.checked)}/> Include pending bookings</label>
      <button onClick={load} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""}/> {loading ? "Generating…" : "Generate Manifest"}</button>
    </div>
    {error && <div className="manifest-error">{error}</div>}
    <div className="manifest-gender-seat-summary">
      <div className="manifest-seat-group male"><strong>Male Seats</strong><span>{maleSeats.length ? maleSeats.join(", ") : "—"}</span></div>
      <div className="manifest-seat-group female"><strong>Female Seats</strong><span>{femaleSeats.length ? femaleSeats.join(", ") : "—"}</span></div>
    </div>
    <div className="manifest-stats manifest-gender-stats">
      <div><span>Passengers</span><strong>{stats.passengers}</strong>{stats.capacity ? <small>/ {stats.capacity}</small> : null}</div>
      <div><span>Male Passengers</span><strong>{maleCount}</strong></div>
      <div><span>Female Passengers</span><strong>{femaleCount}</strong></div>
      <div><span>Vehicle</span><strong>{stats.vehicle?.name || "Multiple / Not selected"}</strong></div>
      <div><span>Occupancy</span><strong>{stats.occupancy == null ? "—" : `${stats.occupancy}%`}</strong></div>
      <div><span>Available</span><strong>{stats.available == null ? "—" : stats.available}</strong></div>
    </div>
    <div className="manifest-actions"><div><strong>{bookings.length}</strong> booking records · {includePending ? "pending included" : "confirmed only"}</div><div><button onClick={() => window.print()}><Printer size={16}/> Print</button><button onClick={downloadPdf} disabled={!bookings.length}><Download size={16}/> PDF</button></div></div>
    <div className="manifest-table-wrap"><table className="manifest-table"><thead><tr><th>#</th><th>Reference</th><th>Passenger</th><th>Gender</th><th>Contact</th><th>Seat Number</th><th>Pickup</th><th>Status</th></tr></thead><tbody>{bookings.map((b, i) => <tr key={b._id}><td>{i + 1}</td><td><strong>{b.bookingReference || "—"}</strong></td><td>{b.customerName}</td><td><span className={`manifest-gender ${String(b.gender || "unknown").toLowerCase()}`}>{b.gender || "N/A"}</span></td><td><Phone size={14}/> {b.contact || "N/A"}</td><td>{seatLabel(b)}</td><td>{b.pickupLocation || "N/A"}</td><td><span className={`manifest-status ${b.status.toLowerCase()}`}>{b.status}</span></td></tr>)}{!bookings.length && <tr><td colSpan="8" className="empty-manifest"><Users size={28}/>{loading ? "Generating manifest…" : "Select filters and generate a manifest."}</td></tr>}</tbody></table></div>
  </div>;
}
