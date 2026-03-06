import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ type: "", number: "", seats: "" });

  // For editing
  const [editingId, setEditingId] = useState(null);

  // Load vehicles
  const loadVehicles = async () => {
    const res = await api.get("/vehicles");
    setVehicles(res.data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Add vehicle
  const addVehicle = async () => {
    if (!form.type || !form.number || !form.seats)
      return alert("Fill all fields!");

    await api.post("/vehicles", form);
    setForm({ type: "", number: "", seats: "" });
    loadVehicles();
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    await api.delete(`/vehicles/${id}`);
    loadVehicles();
  };

  // Start edit
  const startEdit = (v) => {
    setEditingId(v._id);
    setForm({
      type: v.type,
      number: v.number,
      seats: v.seats,
    });
  };

  // Update vehicle
  const updateVehicle = async () => {
    await api.put(`/vehicles/${editingId}`, form);
    setEditingId(null);
    setForm({ type: "", number: "", seats: "" });
    loadVehicles();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vehicle Management</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Type (Bus/Van/Car)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />

        <input
          placeholder="Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />

        <input
          placeholder="Seats"
          type="number"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
        />

        {editingId ? (
          <button onClick={updateVehicle}>Update Vehicle</button>
        ) : (
          <button onClick={addVehicle}>Add Vehicle</button>
        )}
      </div>

      <h3>Vehicle List</h3>

      <ul>
        {vehicles.map((v) => (
          <li key={v._id}>
            {v.type} — {v.number} — {v.seats} seats

            <button onClick={() => startEdit(v)}>Edit</button>
            <button onClick={() => deleteVehicle(v._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
