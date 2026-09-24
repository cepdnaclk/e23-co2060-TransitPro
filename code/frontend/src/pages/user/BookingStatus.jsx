import { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { Search, Phone, CheckCircle2, XCircle, Clock3, Bus, MapPin, Download, FileCheck2, Circle, QrCode } from "lucide-react";
import "../../styles/user/BookingStatus.css";
import { formatPhone, isValidPhone, normalizePhone } from "../../utils/phone";

const steps = ["Pending", "Approved", "Completed"];

export default function BookingStatus() {
  const [contact, setContact] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchBookings = async () => {
    if (!isValidPhone(contact)) return alert("Please enter a valid Sri Lankan phone number with exactly 10 digits (e.g. 0712345678).");
    try {
      const res = await axios.get(`http://localhost:5001/api/bookings/user/${encodeURIComponent(normalizePhone(contact))}`);
      setBookings(res.data); setSearched(true);
    } catch { alert("Unable to fetch bookings"); }
  };

  const ticketPayload = (b) => JSON.stringify({
    booking: b.bookingReference,
    passenger: b.customerName,
    gender: b.gender || "N/A",
    route: b.route ? `${b.route.from} -> ${b.route.to}` : b.vehicle?.name || "Rental",
    date: b.date,
    seats: b.seatNumbers?.length ? b.seatNumbers : b.seats,
    status: b.status,
  });

  const downloadTicket = async (b) => {
    const doc = new jsPDF();
    const qr = await QRCode.toDataURL(ticketPayload(b), { width: 220, margin: 1 });
    doc.setFontSize(22); doc.text("TransitPRO Digital Ticket", 18, 20);
    doc.setFontSize(11); doc.text(`Booking Reference: ${b.bookingReference || b._id}`, 18, 30);
    doc.text(`Passenger: ${b.customerName}`, 18, 42);
    doc.text(`Gender: ${b.gender || "N/A"}`, 18, 50);
    doc.text(`Contact: ${b.contact}`, 18, 58);
    doc.text(`Route: ${b.route ? `${b.route.from} -> ${b.route.to}` : b.vehicle?.name || "Rental Vehicle"}`, 18, 66);
    doc.text(`Date: ${b.date}`, 18, 74);
    doc.text(`Seat Number: ${b.seatNumbers?.length ? b.seatNumbers.join(", ") : b.seats}`, 18, 82);
    doc.text(`Pickup: ${b.pickupLocation || "N/A"}`, 18, 90);
    doc.text(`Status: ${b.status}`, 18, 98);
    doc.addImage(qr, "PNG", 18, 110, 48, 48);
    doc.setFontSize(9); doc.text("Scan the QR code to verify this booking record.", 18, 164);
    doc.save(`TransitPRO_Ticket_${b.bookingReference || b._id}.pdf`);
  };

  const statusIcon = (status) => status === "Approved" || status === "Completed" ? <CheckCircle2 size={16}/> : status === "Rejected" || status === "Cancelled" ? <XCircle size={16}/> : <Clock3 size={16}/>;
  const currentIndex = (status) => status === "Completed" ? 2 : status === "Approved" ? 1 : 0;

  return <div className="status-page">
    <div className="status-hero"><span><FileCheck2 size={15}/> Live Reservation Verification Portal</span><h1>Track Your Booking</h1><p>Use your registered contact number to view booking status, seat details and your digital QR ticket.</p><div className="status-search-box"><Phone size={18}/><input value={contact} onChange={e => setContact(formatPhone(e.target.value))} inputMode="numeric" maxLength={12} onKeyDown={e => e.key === "Enter" && searchBookings()} placeholder="071 234 5678"/><button onClick={searchBookings}><Search size={16}/> Track Reservation</button></div></div>
    {searched && <div className="status-results">{bookings.length === 0 ? <div className="no-bookings"><Search size={40}/><h3>No Reservations Found</h3><p>Please verify the entered contact number.</p></div> : bookings.map(b => <div className="booking-status-card" key={b._id}>
      <div className="status-top"><div><span className="booking-reference">{b.bookingReference || b._id}</span><h3>{b.customerName}</h3><p>{b.route ? `${b.route.from} → ${b.route.to}` : b.vehicle?.name || "Rental Vehicle"}</p></div><span className={`live-pill ${b.status?.toLowerCase() || "pending"}`}>{statusIcon(b.status)}{b.status}</span></div>
      <div className="status-info-grid"><div>Gender: {b.gender || "N/A"}</div><div><Bus size={15}/> Seat Number: {b.seatNumbers?.length ? b.seatNumbers.join(", ") : b.seats}</div><div><MapPin size={15}/> Pickup: {b.pickupLocation || "N/A"}</div><div>Travel Date: {b.date}</div><div>Type: {b.bookingType}</div></div>
      <div className="timeline">{steps.map((step, i) => <div className={`timeline-step ${i <= currentIndex(b.status) && !["Rejected","Cancelled"].includes(b.status) ? "done" : ""}`} key={step}><div className="timeline-dot">{i <= currentIndex(b.status) ? <CheckCircle2 size={16}/> : <Circle size={14}/>}</div><span>{step}</span>{i < steps.length - 1 && <div className="timeline-line"/>}</div>)}</div>
      {(b.status === "Rejected" || b.status === "Cancelled") && <div className="status-alert"><XCircle size={17}/> This booking is {b.status.toLowerCase()}.</div>}
      <div className="ticket-actions"><button className="receipt-btn" onClick={() => downloadTicket(b)}><QrCode size={16}/> Download QR Digital Ticket</button><button className="secondary-ticket-btn" onClick={() => downloadTicket(b)}><Download size={16}/> PDF</button></div>
    </div>)}</div>}
  </div>;
}
