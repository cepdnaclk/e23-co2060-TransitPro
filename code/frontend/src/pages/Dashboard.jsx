import React, { useEffect, useState } from "react";

// Centralized API base URL to simplify updates and maintain consistency
const API_BASE_URL = "http://localhost:5001/api";

export default function Dashboard() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  // Stores dashboard metrics and recent bookings returned from the API
  const [data, setData] = useState(null);
  
  // Stores error message for rendering error state
  const [error, setError] = useState("");

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // API DATA FETCHING
  // ==========================================
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);

      // Check for non-2xx HTTP responses
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard");
    }
  };

  // ==========================================
  // EARLY RETURNS (LOADING / ERROR STATES)
  // ==========================================
  if (error) return <h2>{error}</h2>;
  if (!data) return <h2>Loading...</h2>;

  // Safe reference fallback for recent bookings list
  const recentBookings = data.recentBookings || [];

  // ==========================================
  // MAIN UI RENDER
  // ==========================================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Metrics Counter Section */}
      <div style={{ marginTop: "20px" }}>
        <p><b>Total Vehicles:</b> {data.totalVehicles ?? 0}</p>
        <p><b>Total Routes:</b> {data.totalRoutes ?? 0}</p>
        <p><b>Total Bookings:</b> {data.totalBookings ?? 0}</p>
        <p><b>Today's Bookings:</b> {data.todaysBookings ?? 0}</p>
      </div>

      <h2>Recent Bookings</h2>

      {/* Recent Bookings List */}
      {recentBookings.length === 0 ? (
        <p>No recent bookings</p>
      ) : (
        recentBookings.map((b) => (
          <div key={b._id}>
            {b.customerName || "—"} — {b.date || "—"} — Seats: {b.seats ?? 0}
          </div>
        ))
      )}
    </div>
  );
}
