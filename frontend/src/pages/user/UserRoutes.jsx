import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/user/userRoutes.css";

export default function UserRoutes() {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load routes", err);
    }
  };

  const filtered = routes.filter(r =>
    `${r.from} ${r.to}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-routes-page">
      <h1>Available Routes</h1>

      <input
        className="route-search"
        placeholder="Search by city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="route-grid">
        {filtered.length === 0 ? (
          <p className="empty">No routes found</p>
        ) : (
          filtered.map((r) => (
            <div className="route-card" key={r._id}>
              <div className="route-path">
                <span>{r.from}</span>
                <span className="arrow">→</span>
                <span>{r.to}</span>
              </div>

              <div className="route-price">
                Rs. {r.price}
              </div>

              {/* ✅ USER ACTION */}
              <button
                className="route-btn"
                onClick={() => navigate(`/routes/${r._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
