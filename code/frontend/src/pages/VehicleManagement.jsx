import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Pencil, Trash2, CarFront } from "lucide-react";
import "../styles/vehiclemanagement.css";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    seats: "",
    comfort: "",
    rentPrice: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadVehicles = async () => {
    const res = await axios.get("http://localhost:5001/api/vehicles");
    setVehicles(res.data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.seats) {
      return alert("Please fill all required fields");
    }

    if (editingId) {
      await axios.put(`http://localhost:5001/api/vehicles/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5001/api/vehicles", form);
    }

    setForm({
      name: "",
      type: "",
      seats: "",
      comfort: "",
      rentPrice: "",
    });

    loadVehicles();
  };

  const handleEdit = (v) => {
    setForm(v);
    setEditingId(v._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      await axios.delete(`http://localhost:5001/api/vehicles/${id}`);
      loadVehicles();
    }
  };

  return (
    <div className="manage-wrapper">
      <div className="manage-top">
        <h1>Fleet Vehicle Management</h1>
        <p>Register, update and maintain available rental and transport fleet</p>
      </div>

      <div className="manage-form-card">
        <input
          placeholder="Vehicle Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Vehicle Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          placeholder="Seat Capacity"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
        />
        <input
          placeholder="Comfort (AC / Non-AC)"
          value={form.comfort}
          onChange={(e) => setForm({ ...form, comfort: e.target.value })}
        />
        <input
          placeholder="Rent Price"
          value={form.rentPrice}
          onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
        />

        <button onClick={handleSubmit}>
          <PlusCircle size={18} />
          {editingId ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>

      <div className="data-card">
        <div className="table-header-title">
          <CarFront size={18} />
          Registered Fleet Vehicles
        </div>

        <table>
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Comfort</th>
              <th>Rent Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.seats}</td>
                <td>{v.comfort || "N/A"}</td>
                <td>Rs. {v.rentPrice || 0}</td>
                <td>
                  <span className="status-badge">Available</span>
                </td>
                <td className="action-cell">
                  <button className="edit-btn" onClick={() => handleEdit(v)}>
                    <Pencil size={15} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(v._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}