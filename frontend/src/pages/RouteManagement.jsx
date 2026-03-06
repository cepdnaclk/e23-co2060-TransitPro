// src/pages/RouteManagement.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/routemanagement.css"; // ← separate CSS file

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ from: "", to: "", price: "" });
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");

  const loadRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const addRoute = async () => {
    if (!form.from || !form.to || !form.price)
      return alert("Fill all fields");

    try {
      await api.post("/routes", form);
      setForm({ from: "", to: "", price: "" });
      loadRoutes();
    } catch (e) {
      alert("Add failed");
    }
  };

  const startEdit = (r) => {
    setEditing(r._id);
    setForm({ from: r.from, to: r.to, price: r.price });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveRoute = async () => {
    try {
      await api.put(`/routes/${editing}`, form);
      setEditing(null);
      setForm({ from: "", to: "", price: "" });
      loadRoutes();
    } catch (e) {
      alert("Update failed");
    }
  };

  const deleteRoute = async (id) => {
    if (!confirm("Delete this route?")) return;
    await api.delete(`/routes/${id}`);
    loadRoutes();
  };

  const filtered = routes.filter((r) =>
    `${r.from} ${r.to} ${r.price}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="route-page-wide">
      <h1>Route Management</h1>

      <div className="rt-top">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search routes..."
          className="rt-search"
        />
      </div>

      <div className="rt-form-card">
        <h3>{editing ? "Edit Route" : "Add New Route"}</h3>

        <div className="rt-form-grid">
          <input
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            placeholder="From"
          />
          <input
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            placeholder="To"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price (Rs.)"
          />

          <div className="rt-actions">
            {!editing ? (
              <button className="btn add" onClick={addRoute}>
                Add Route
              </button>
            ) : (
              <button className="btn save" onClick={saveRoute}>
                Save
              </button>
            )}

            <button
              className="btn cancel"
              onClick={() => {
                setForm({ from: "", to: "", price: "" });
                setEditing(null);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rt-table-card">
        <table className="rt-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "14px" }}>
                  No routes found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id}>
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td style={{ textAlign: "center" }}>Rs. {r.price}</td>
                  <td className="rt-btn-group">
                    <button className="btn edit" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button className="btn del" onClick={() => deleteRoute(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
