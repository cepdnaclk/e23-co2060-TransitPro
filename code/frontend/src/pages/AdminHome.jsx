import React, { useEffect, useState } from "react";
import "./../styles/AdminHome.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Bus,
  Route,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <h2 className="loading-screen">Loading Executive Analytics...</h2>;

  return (
    <div className="premium-dashboard">

      <div className="dash-headline">
        <h1>Executive Analytics Dashboard</h1>
        <p>Enterprise booking intelligence, operational trends and live reservation monitoring</p>
      </div>

      {/* KPI SECTION */}
      <div className="premium-stats-grid">
        <div className="premium-card blue">
          <Bus size={32}/>
          <div>
            <span>Total Vehicles</span>
            <h2>{data.totalVehicles}</h2>
          </div>
        </div>

        <div className="premium-card green">
          <Route size={32}/>
          <div>
            <span>Total Routes</span>
            <h2>{data.totalRoutes}</h2>
          </div>
        </div>

        <div className="premium-card orange">
          <ClipboardList size={32}/>
          <div>
            <span>Total Bookings</span>
            <h2>{data.totalBookings}</h2>
          </div>
        </div>

        <div className="premium-card purple">
          <Clock3 size={32}/>
          <div>
            <span>Pending</span>
            <h2>{data.pendingBookings}</h2>
          </div>
        </div>

        <div className="premium-card emerald">
          <CheckCircle2 size={32}/>
          <div>
            <span>Approved</span>
            <h2>{data.approvedBookings}</h2>
          </div>
        </div>

        <div className="premium-card red">
          <XCircle size={32}/>
          <div>
            <span>Rejected</span>
            <h2>{data.rejectedBookings}</h2>
          </div>
        </div>
      </div>

      {/* CHART ROW 1 */}
      <div className="premium-chart-grid">
        <div className="glass-card large">
          <h3>Weekly Booking Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.weeklyBookings}>
              <defs>
                <linearGradient id="bookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stroke="#2563eb" fill="url(#bookings)" strokeWidth={4}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3>Booking Type Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.bookingTypeData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                label
              >
                {data.bookingTypeData.map((_, i) => (
                  <Cell key={i} fill={["#2563eb","#10b981","#f59e0b","#8b5cf6"][i % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART ROW 2 */}
      <div className="premium-chart-grid">
        <div className="glass-card">
          <h3>Approval Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.statusData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                label
              >
                {data.statusData.map((_, i) => (
                  <Cell key={i} fill={["#8b5cf6","#10b981","#ef4444"][i % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card large">
          <h3>Most Demanded Routes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topDemandRoutes}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" radius={[10,10,0,0]} fill="#2563eb"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOOKING TABLE */}
      <div className="premium-booking-card">
        <h2>Latest Customer Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Gender</th>
              <th>Trip / Vehicle</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.recentBookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customerName}</td>
                <td>{b.gender || "N/A"}</td>
                <td>{b.route ? `${b.route.from} → ${b.route.to}` : b.vehicle?.name || "Rental"}</td>
                <td>{b.date}</td>
                <td>{b.seats}</td>
                <td>
                  <span className={`status-pill ${b.status?.toLowerCase() || "pending"}`}>
                    {b.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}