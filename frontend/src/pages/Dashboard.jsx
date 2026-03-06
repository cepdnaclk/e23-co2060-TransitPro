import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard");
      });
  }, []);

  if (error) return <h2>{error}</h2>;
  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <p><b>Total Vehicles:</b> {data.totalVehicles}</p>
        <p><b>Total Routes:</b> {data.totalRoutes}</p>
        <p><b>Total Bookings:</b> {data.totalBookings}</p>
        <p><b>Today's Bookings:</b> {data.todaysBookings}</p>
      </div>

      <h2>Recent Bookings</h2>
      {data.recentBookings.length === 0 ? (
        <p>No recent bookings</p>
      ) : (
        data.recentBookings.map((b) => (
          <div key={b._id}>
            {b.customerName} — {b.date} — Seats: {b.seats}
          </div>
        ))
      )}
    </div>
  );
}
