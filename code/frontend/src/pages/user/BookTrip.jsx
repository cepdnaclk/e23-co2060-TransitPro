import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createBooking, getBookedSeats } from "../../services/bookingService";
import {
  MapPinned,
  Clock3,
  Ticket,
  User,
  Phone,
  CalendarDays,
  UserRound,
  BusFront,
  CheckCircle2,
  Armchair,
} from "lucide-react";
import "../../styles/user/BookTrip.css";
import { formatPhone, isValidPhone, normalizePhone } from "../../utils/phone";

export default function BookTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookedSeatGender, setBookedSeatGender] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    gender: "",
    contact: "",
    date: "",
    pickupLocation: "",
  });

  const totalSeats = route?.vehicle?.seats || 40;

  // Build a realistic 2 + aisle + 2 bus layout.
  // Regular rows have 4 seats (2 left, 2 right of the aisle).
  // Any leftover seats that don't fill a full row become a single
  // full-width "rear bench" row, like the back row of a real coach.
  const buildSeatLayout = (total) => {
    const rows = [];
    const fullRows = Math.floor(total / 4);
    const remainder = total % 4;
    let seatNum = 1;

    for (let r = 0; r < fullRows; r++) {
      rows.push([seatNum, seatNum + 1, null, seatNum + 2, seatNum + 3]);
      seatNum += 4;
    }

    if (remainder > 0) {
      const bench = [];
      for (let i = 0; i < remainder; i++) {
        bench.push(seatNum + i);
      }
      rows.push(bench);
    }

    return rows;
  };

  const seatLayout = buildSeatLayout(totalSeats);
  const hasBenchRow = totalSeats % 4 !== 0;

  async function loadRoute() {
    try {
      const res = await axios.get(`http://localhost:5001/api/routes/${id}`);
      setRoute(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadBookedSeats(routeId, date) {
    try {
      setSeatsLoading(true);
      setSelectedSeats([]);
      const res = await getBookedSeats(routeId, date);
      const booked = (res.data.bookedSeats || []).map(Number).filter(Number.isInteger);
      const genderMap = res.data.seatGender || {};
      setBookedSeats(booked);
      setBookedSeatGender(genderMap);
    } catch (err) {
      console.log(err);
    } finally {
      setSeatsLoading(false);
    }
  }

  useEffect(() => {
    loadRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever the travel date changes, refresh which seats are already taken
  // for this route on that date, and clear any previous selection.
  useEffect(() => {
    if (route && form.date) {
      loadBookedSeats(route._id, form.date);
    } else {
      setBookedSeats([]);
      setBookedSeatGender({});
      setSelectedSeats([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, route?._id]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const isTripFormComplete =
    form.customerName.trim().length > 0 &&
    form.gender &&
    isValidPhone(form.contact) &&
    form.date &&
    selectedSeats.length > 0 &&
    form.pickupLocation.trim().length > 0;

  const handleSubmit = async () => {
    if (bookingLoading) return;
    if (!form.customerName.trim()) {
      alert("Please enter the passenger full name.");
      return;
    }
    if (!form.gender) {
      alert("Please select the passenger gender.");
      return;
    }
    if (!isValidPhone(form.contact)) {
      alert("Please enter a valid Sri Lankan phone number with exactly 10 digits (e.g. 0712345678).");
      return;
    }
    if (!form.date) {
      alert("Please choose a travel date.");
      return;
    }
    if (!selectedSeats.length) {
      alert("Please select at least one seat.");
      return;
    }
    if (!form.pickupLocation.trim()) {
      alert("Please enter the pickup location.");
      return;
    }

    try {
      setBookingLoading(true);
      const created = await createBooking({
        ...form,
        contact: normalizePhone(form.contact),
        seats: selectedSeats.length,
        seatNumbers: selectedSeats,
        route: route._id,
        vehicle: route.vehicle?._id || null,
        bookingType: "Trip",
        status: "Pending",
      });

      alert(
        `Booking ${created.data?.bookingReference || "submitted"} created successfully! Seat(s): ${selectedSeats
          .sort((a, b) => a - b)
          .join(", ")}`
      );

      setForm({
        customerName: "",
        gender: "",
        contact: "",
        date: "",
        pickupLocation: "",
      });
      setSelectedSeats([]);
      setBookedSeats([]);
      setBookedSeatGender({});
      if (created.data?.bookingReference) navigate(`/status`);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      const message = err.response?.data?.error || err.message || "Booking Failed";
      alert(message);
      if (route && form.date) {
        await loadBookedSeats(route._id, form.date);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (!route) return <h2 style={{padding:"150px", textAlign:"center"}}>Loading Route...</h2>;

  return (
    <div className="booktrip-container">
      <div className="booktrip-grid">

        <div className="route-summary-card">
          <span className="trip-badge">Smart Route Reservation</span>
          <h1>Transport Booking Checkout</h1>

          <div className="route-line">
            <MapPinned size={18}/>
            <h2>{route.from} → {route.to}</h2>
          </div>

          <div className="summary-item">
            <Clock3 size={16}/> Departure: {route.departureTime}
          </div>

          <div className="summary-item">
            <Clock3 size={16}/> Arrival: {route.arrivalTime}
          </div>

          <div className="summary-item">
            <BusFront size={16}/> Vehicle: {route.vehicle?.name || "Pending Vehicle"}
          </div>

          <div className="price-box">
            <Ticket size={17}/>
            {selectedSeats.length > 0
              ? `Total: Rs. ${route.price * selectedSeats.length} (${selectedSeats.length} x Rs. ${route.price})`
              : `Ticket Price: Rs. ${route.price}`}
          </div>

          <div className="booking-note">
            <CheckCircle2 size={16}/>
            Booking confirmations are verified by TransitPRO transport administration.
          </div>
        </div>

        <div className="booking-form-card">
          <h2>Enter Passenger Details <span className="required-hint">* All fields are required</span></h2>

          <div className="form-input">
            <User size={17}/>
            <input
              placeholder="Customer Full Name *"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>

          <div className="gender-input-group">
            <div className="gender-label"><UserRound size={17}/> <span>Passenger Gender <b>*</b></span></div>
            <div className="gender-options">
              <label className={`gender-option ${form.gender === "Male" ? "active male" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                />
                Male
              </label>
              <label className={`gender-option ${form.gender === "Female" ? "active female" : ""}`}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                />
                Female
              </label>
            </div>
          </div>

          <div className="form-input">
            <Phone size={17}/>
            <input
              placeholder="071 234 5678 *"
              value={form.contact}
              inputMode="numeric"
              maxLength={12}
              onChange={(e) => setForm({ ...form, contact: formatPhone(e.target.value) })}
            />
          </div>

          <div className="form-input">
            <CalendarDays size={17}/>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="seat-section">
            <div className="seat-section-header">
              <Armchair size={17}/>
              <span>Select Your Seat(s)</span>
              {selectedSeats.length > 0 && (
                <span className="seat-count-pill">
                  {selectedSeats.length} selected
                </span>
              )}
            </div>

            {!form.date ? (
              <div className="seat-map-placeholder">
                Choose a travel date above to see available seats.
              </div>
            ) : seatsLoading ? (
              <div className="seat-map-placeholder">Loading seat map...</div>
            ) : (
              <>
                <div className="seat-driver-row">
                  <BusFront size={16}/> <span>Front</span>
                </div>

                <div className="seat-rows">
                  {seatLayout.map((row, rowIndex) => (
                    <div
                      className={`seat-row ${
                        row.length < 4 ? "seat-row-bench" : ""
                      }`}
                      key={rowIndex}
                    >
                      {row.map((seatNumber, seatIndex) => {
                        if (seatNumber === null) {
                          return (
                            <div
                              className="seat-aisle"
                              key={`aisle-${rowIndex}-${seatIndex}`}
                            />
                          );
                        }

                        const isBooked = bookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);
                        const seatGender = bookedSeatGender[String(seatNumber)];
                        const genderClass = seatGender === "Male" ? "male-booked" : seatGender === "Female" ? "female-booked" : "booked";

                        return (
                          <button
                            type="button"
                            key={seatNumber}
                            className={`seat ${isBooked ? `booked ${genderClass}` : ""} ${
                              isSelected ? "selected" : ""
                            }`}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatNumber)}
                            title={
                              isBooked
                                ? `Seat ${seatNumber} - booked by ${seatGender || "another passenger"}`
                                : `Seat ${seatNumber} - available`
                            }
                          >
                            <span className="seat-number">{seatNumber}</span>
                            {isBooked && seatGender && (
                              <span className="seat-gender-badge">{seatGender === "Male" ? "M" : "F"}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {hasBenchRow && <div className="seat-rear-label">Rear</div>}

                <div className="seat-gender-note">
                  <UserRound size={14}/> M/F shows the gender category of an already-booked seat. Available seats remain selectable.
                </div>

                <div className="seat-legend">
                  <span><i className="legend-box available"/> Available</span>
                  <span><i className="legend-box selected"/> Your Selection</span>
                  <span><i className="legend-box male-booked"/> Male Booked (M)</span>
                  <span><i className="legend-box female-booked"/> Female Booked (F)</span>
                  <span><i className="legend-box booked"/> Booked / Gender unavailable</span>
                </div>
              </>
            )}
          </div>

          <div className="form-input">
            <MapPinned size={17}/>
            <input
              placeholder="Pickup Location *"
              value={form.pickupLocation}
              onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
            />
          </div>

          <div className={`booking-required-message ${isTripFormComplete ? "complete" : "incomplete"}`}>
            {isTripFormComplete
              ? "✓ All required details are completed. You can confirm your booking."
              : "Please complete every field (*) and select at least one seat."}
          </div>

          <button className="confirm-btn" onClick={handleSubmit} disabled={bookingLoading || seatsLoading || !isTripFormComplete}>
            {bookingLoading ? "Submitting Booking..." : "Confirm My Booking"}
          </button>
        </div>

      </div>
    </div>
  );
}