import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    route: "",
    vehicle: "",
    date: "",
    seats: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const b = await axios.get("http://localhost:5001/api/bookings");
      setBookings(b.data);

      const r = await axios.get("http://localhost:5001/api/routes");
      setRoutes(r.data);

      const v = await axios.get("http://localhost:5001/api/vehicles");
      setVehicles(v.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ---------- EDIT ----------
  const startEdit = (b) => {
    setEditing(b._id);
    setForm({
      customerName: b.customerName || "",
      route: b.route?._id || "",
      vehicle: b.vehicle?._id || "",
      date: b.date || "",
      seats: b.seats || ""
    });
  };

  const submitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/bookings/${editing}`,
        {
          customerName: form.customerName,
          route: form.route,
          vehicle: form.vehicle || null,
          date: form.date,
          seats: Number(form.seats)
        }
      );
      setEditing(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // ---------- DELETE ----------
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;
    await axios.delete(`http://localhost:5001/api/bookings/${id}`);
    fetchAll();
  };

  return (
    <div>
      <h2>Admin Bookings</h2>

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
          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" align="center">
                No bookings found
              </td>
            </tr>
          )}

          {bookings.map(b => (
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
                <button onClick={() => startEdit(b)}>Edit</button>
                <button
                  style={{ marginLeft: "8px", color: "red" }}
                  onClick={() => deleteBooking(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- EDIT FORM ---------- */}
      {editing && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit Booking</h3>

          <input
            value={form.customerName}
            onChange={e =>
              setForm({ ...form, customerName: e.target.value })
            }
            placeholder="Customer name"
          />

          <br />

          <select
            value={form.route}
            onChange={e => setForm({ ...form, route: e.target.value })}
          >
            <option value="">Select Route</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>
                {r.from} → {r.to}
              </option>
            ))}
          </select>

          <br />

          <select
            value={form.vehicle}
            onChange={e => setForm({ ...form, vehicle: e.target.value })}
          >
            <option value="">No Vehicle</option>
            {vehicles.map(v => (
              <option key={v._id} value={v._id}>
                {v.number} ({v.type})
              </option>
            ))}
          </select>

          <br />

          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <br />

          <input
            type="number"
            value={form.seats}
            onChange={e => setForm({ ...form, seats: e.target.value })}
            placeholder="Seats"
          />

          <br /><br />

          <button onClick={submitEdit}>Save</button>
          <button onClick={() => setEditing(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
