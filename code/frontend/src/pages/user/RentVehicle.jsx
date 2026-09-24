import { useEffect, useState } from "react";
import { getVehicles } from "../../services/vehicleService";
import { createBooking } from "../../services/bookingService";
import {
  CarFront,
  Users,
  ShieldCheck,
  BadgeDollarSign,
  X,
  CalendarDays,
  Phone,
  MapPinned,
  User,
} from "lucide-react";
import "../../styles/user/RentVehicle.css";
import { formatPhone, isValidPhone, normalizePhone } from "../../utils/phone";

export default function RentVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    date: "",
    seats: 1,
    pickupLocation: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isRentalFormComplete =
    form.customerName.trim().length > 0 &&
    isValidPhone(form.contact) &&
    form.date &&
    Number(form.seats) >= 1 &&
    Number(form.seats) <= Number(selectedVehicle?.seats || 0) &&
    form.pickupLocation.trim().length > 0;

  const handleRent = async () => {
    if (!selectedVehicle) return;
    if (!form.customerName.trim()) {
      alert("Please enter the customer full name.");
      return;
    }
    if (!isValidPhone(form.contact)) {
      alert("Please enter a valid Sri Lankan phone number with exactly 10 digits (e.g. 0712345678).");
      return;
    }
    if (!form.date) {
      alert("Please choose a rental date.");
      return;
    }
    if (!Number.isInteger(Number(form.seats)) || Number(form.seats) < 1 || Number(form.seats) > Number(selectedVehicle.seats)) {
      alert(`Please enter a passenger count between 1 and ${selectedVehicle.seats}.`);
      return;
    }
    if (!form.pickupLocation.trim()) {
      alert("Please enter the pickup location.");
      return;
    }
    try {
      await createBooking({
        ...form,
        contact: normalizePhone(form.contact),
        route: null,
        vehicle: selectedVehicle._id,
        bookingType: "Rental",
        status: "Pending",
      });

      alert("Rental Booking Submitted Successfully!");
      setSelectedVehicle(null);

      setForm({
        customerName: "",
        contact: "",
        date: "",
        seats: 1,
        pickupLocation: "",
      });
    } catch (err) {
      console.log(err);
      alert("Booking Failed");
    }
  };

  return (
    <div className="rent-page">
      <div className="rent-header">
        <span>Premium Mobility Rental Fleet</span>
        <h1>Reserve Your Ideal Rental Vehicle</h1>
        <p>
          Select from our modern buses, vans and cars for comfortable personal,
          academic or group transportation with instant booking approval.
        </p>
      </div>

      <div className="rent-grid">
        {vehicles.map((v) => (
          <div className="rent-card" key={v._id}>
            <div className="vehicle-top">
              <div className="vehicle-icon">
                <CarFront size={24} />
              </div>
              <div className="rent-price">Rs. {v.rentPrice}</div>
            </div>

            <h2>{v.name}</h2>

            <div className="vehicle-info">
              <p><CarFront size={16}/> Type: {v.type}</p>
              <p><Users size={16}/> Seats: {v.seats}</p>
              <p><ShieldCheck size={16}/> Comfort: {v.comfort}</p>
              <p><BadgeDollarSign size={16}/> Rental Price: Rs. {v.rentPrice}</p>
            </div>

            <button onClick={() => setSelectedVehicle(v)}>Rent This Vehicle</button>
          </div>
        ))}
      </div>

      {selectedVehicle && (
        <div className="rental-modal">
          <div className="rental-form-box">
            <div className="modal-close" onClick={() => setSelectedVehicle(null)}>
              <X size={20}/>
            </div>

            <h2>Complete Rental Reservation <span className="required-hint">* All fields are required</span></h2>
            <p className="selected-name">{selectedVehicle.name}</p>

            <div className="input-box">
              <User size={17}/>
              <input
                placeholder="Customer Full Name *"
                value={form.customerName}
                onChange={(e)=>setForm({...form, customerName:e.target.value})}
              />
            </div>

            <div className="input-box">
              <Phone size={17}/>
              <input
                placeholder="071 234 5678 *"
                value={form.contact}
                inputMode="numeric"
                maxLength={12}
                onChange={(e)=>setForm({...form, contact:formatPhone(e.target.value)})}
              />
            </div>

            <div className="input-box">
              <CalendarDays size={17}/>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e)=>setForm({...form, date:e.target.value})}
              />
            </div>

            <div className="input-box">
              <Users size={17}/>
              <input
                type="number"
                placeholder="Required Passenger Seats *"
                value={form.seats}
                onChange={(e)=>setForm({...form, seats:e.target.value})}
              />
            </div>

            <div className="input-box">
              <MapPinned size={17}/>
              <input
                placeholder="Pickup Location *"
                value={form.pickupLocation}
                onChange={(e)=>setForm({...form, pickupLocation:e.target.value})}
              />
            </div>

            <div className={`booking-required-message ${isRentalFormComplete ? "complete" : "incomplete"}`}>
              {isRentalFormComplete
                ? "✓ All required details are completed. You can confirm the rental."
                : "Please complete every field (*) before confirming the rental."}
            </div>

            <button className="confirm-btn" onClick={handleRent} disabled={!isRentalFormComplete}>
              Confirm Rental Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}