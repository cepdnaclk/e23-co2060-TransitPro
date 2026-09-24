import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import "../../styles/user/seatBooking.css";

export default function RouteDetails() {
  const { id } = useParams();

  const [route, setRoute] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const TOTAL_SEATS = 40;

  useEffect(() => {
    loadRoute();
  }, []);

  useEffect(() => {
    if (date) loadBookedSeats();
  }, [date]);

  const loadRoute = async () => {
    const res = await api.get(`/routes/${id}`);
    setRoute(res.data);
  };

  const loadBookedSeats = async () => {
    const res = await api.get(
      `/bookings/seats?route=${id}&date=${date}`
    );
    setBookedSeats(res.data);
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const submitBooking = async () => {
    try {
      if (!customer || !date || selectedSeats.length === 0)
        return alert("Fill all fields");

      await api.post("/bookings", {
        route: id,
        customer,
        date,
        seats: selectedSeats,
      });

      alert("Booking successful 🎉");
      setSelectedSeats([]);
      loadBookedSeats();

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!route) return <p>Loading...</p>;

  return (
    <div className="booking-page">
      <h1>{route.from} → {route.to}</h1>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input placeholder="Your Name" value={customer}
        onChange={e => setCustomer(e.target.value)} />

      <div className="seat-grid">
        {Array.from({ length: TOTAL_SEATS }).map((_, i) => {
          const seat = i + 1;
          return (
            <div
              key={seat}
              className={`seat
                ${bookedSeats.includes(seat) ? "locked" : ""}
                ${selectedSeats.includes(seat) ? "selected" : ""}
              `}
              onClick={() => toggleSeat(seat)}
            >
              {seat}
            </div>
          );
        })}
      </div>

      <button onClick={submitBooking}>
        Book {selectedSeats.length} Seats
      </button>
    </div>
  );
}
