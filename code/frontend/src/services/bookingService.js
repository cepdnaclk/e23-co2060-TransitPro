import axios from "axios";

// Accept either of these values in frontend/.env:
// VITE_API_URL=http://localhost:5001
// VITE_API_URL=http://localhost:5001/api
// The helper below always produces the API root ending in /api.
const configured = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/$/, "");
const API_ROOT = configured.endsWith("/api") ? configured : `${configured}/api`;
const BOOKING_API = `${API_ROOT}/bookings`;

export const createBooking = (data) => axios.post(BOOKING_API, data);

export const getBookingsByContact = (contact) =>
  axios.get(`${BOOKING_API}/user/${encodeURIComponent(contact)}`);

export const getBookedSeats = (routeId, date) =>
  axios.get(
    `${BOOKING_API}/seats/${encodeURIComponent(routeId)}/${encodeURIComponent(date)}`
  );
