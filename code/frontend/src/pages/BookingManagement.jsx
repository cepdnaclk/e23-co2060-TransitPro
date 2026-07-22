import { useEffect, useState } from "react";
import axios from "axios";

// Extract base URL to reduce repetitive code and simplify future environment updates
const API_BASE_URL = "http://localhost:5001/api";

export default function AdminBookings() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  // Lists fetched from backend
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Holds the _id of the booking currently being edited (null if not editing)
  const [editingId, setEditingId] = useState(null);

  // Form fields state for editing a booking
  const [formData, setFormData] = useState({
    customerName: "",
    route: "",
    vehicle: "",
    date: "",
    seats: ""
  });

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  useEffect(() => {
    fetchAllData();
  }, []);

  // ==========================================
  // API DATA FETCHING
  // ==========================================
  // Uses Promise.all to trigger all 3 API requests concurrently rather than sequentially
  const fetchAllData = async () => {
    try {
      const [bookingsRes, routesRes, vehiclesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/bookings`),
        axios.get(`${API_BASE_URL}/routes`),
        axios.get(`${API_BASE_URL}/vehicles`)
      ]);

      setBookings(bookingsRes.data);
      setRoutes(routesRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ==========================================
  // FORM & ACTION HANDLERS
  // ==========================================
  // Reusable helper function to update individual form inputs by field name
  const handleInputChange = (field, value) => {
    setFormData((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
  };

  // Populate form with existing booking data and enable edit mode
  const handleStartEdit = (booking) => {
    setEditingId(booking._id);

    // Formats ISO dates (e.g., 'YYYY-MM-DDTHH:mm:ss') for HTML5 date input compatibility
    const formattedDate = booking.date ? booking.date.substring(0, 10) : "";

    setFormData({
      customerName: booking.customerName || "",
      route: booking.route?._id || "",
      vehicle: booking.vehicle?._id || "",
      date: formattedDate,
      seats: booking.seats || ""
    });
  };

  // Submit form updates to backend
  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await axios.put(`${API_BASE_URL}/bookings/${editingId}`, {
        customerName: formData.customerName,
        route: formData.route,
        vehicle: formData.vehicle || null,
        date: formData.date,
        seats: Number(formData.seats)
      });

      setEditingId(null);
      await fetchAllData();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  // Exit edit mode without saving changes
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Delete a booking after confirmation
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/bookings/${id}`);
      await fetchAllData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ==========================================
  // UI RENDER
  // ==========================================
  return (
    <div>
      <h2>Admin Bookings</h2>

      {/* Main Bookings Display Table */}
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Route</th>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Displayed when no records are returned */}
          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" align="center">
                No bookings found
              </td>
            </tr>
          )}

          {/* Render each booking record */}
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.customerName || "—"}</td>

              <td>
                {b.route
                  ? `${b.route.from} → ${b.route.to}`
                  : "N/A"}
              </td>

              <td>
                {b.vehicle
                  ? `${b.vehicle.number} (${b.vehicle.type})`
                  : "N/A"}
              </td>

              <td>{b.date || "—"}</td>
              <td>{b.seats}</td>

              <td>
                <button onClick={() => handleStartEdit(b)}>Edit</button>
                <button
                  style={{ marginLeft: "8px", color: "red" }}
                  onClick={() => handleDeleteBooking(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Booking Panel (Rendered only during active edit mode) */}
      {editingId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit Booking</h3>

          {/* Customer Name Field */}
          <input
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            placeholder="Customer name"
          />

          <br />

          {/* Route Selector Dropdown */}
          <select
            value={formData.route}
            onChange={(e) => handleInputChange("route", e.target.value)}
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.from} → {r.to}
              </option>
            ))}
          </select>

          <br />

          {/* Vehicle Selector Dropdown */}
          <select
            value={formData.vehicle}
            onChange={(e) => handleInputChange("vehicle", e.target.value)}
          >
            <option value="">No Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.number} ({v.type})
              </option>
            ))}
          </select>

          <br />

          {/* Booking Date Selector */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />

          <br />

          {/* Number of Seats Field */}
          <input
            type="number"
            value={formData.seats}
            onChange={(e) => handleInputChange("seats", e.target.value)}
            placeholder="Seats"
          />

          <br />
          <br />

          {/* Action Buttons */}
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}
