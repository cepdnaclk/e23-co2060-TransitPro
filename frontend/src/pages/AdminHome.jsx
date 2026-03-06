// src/pages/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import "../styles/AdminHome.css";

export default function AdminHome(){
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ fetchDashboard(); },[]);

  const fetchDashboard = async ()=>{
    try{
      const res = await axios.get("http://localhost:5001/api/dashboard");
      setData(res.data);
    }catch(e){
      console.error(e);
    }finally{ setLoading(false); }
  };

  if(loading) return <div className="loading">Loading...</div>;
  if(!data) return <div className="loading">Failed to load</div>;

  const {
    totalVehicles=0, totalRoutes=0, totalBookings=0, todaysBookings=0,
    bookingsHistory=[], vehicleUsage=[], recentBookings=[]
  } = data;

  const COLORS = ["#0077d6","#00b3a6","#f6c43b","#ff7a59"];

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
      </header>

      <section className="cards-grid">
        <div className="card accent-1">
          <div className="card-title">Total Vehicles</div>
          <div className="card-value">{totalVehicles}</div>
        </div>
        <div className="card accent-2">
          <div className="card-title">Total Routes</div>
          <div className="card-value">{totalRoutes}</div>
        </div>
        <div className="card accent-3">
          <div className="card-title">Total Bookings</div>
          <div className="card-value">{totalBookings}</div>
        </div>
        <div className="card accent-4">
          <div className="card-title">Today's Bookings</div>
          <div className="card-value">{todaysBookings}</div>
        </div>
      </section>

      <section className="grid-2">
        <div className="chart-card">
          <h3>Booking History (Last 7 days)</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsHistory}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0077d6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Vehicle Usage</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehicleUsage.length?vehicleUsage:[{name:'No Data', value:1}]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {(vehicleUsage.length?vehicleUsage:[{name:'No Data'}]).map((e,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="recent-card">
        <h3>Recent Bookings</h3>
        <table className="recent-table">
          <thead><tr><th>Customer</th><th>Vehicle</th><th>Date</th></tr></thead>
          <tbody>
            {recentBookings.length===0 ? <tr><td colSpan="3">No recent bookings</td></tr> :
              recentBookings.map((b,i)=>(
                <tr key={i}><td>{b.customerName}</td><td>{b.vehicle?.number||'N/A'}</td><td>{b.date}</td></tr>
              ))
            }
          </tbody>
        </table>
      </section>
    </div>
  );
}
