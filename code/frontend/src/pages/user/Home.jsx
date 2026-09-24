import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageStats } from "../../services/homeService";
import {
  Bus,
  Car,
  Clock3,
  ShieldCheck,
  Search,
  MapPinned,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "../../styles/user/home.css";

export default function Home() {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalVehicles: 0,
    schedules: [],
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadHomepage();
  }, []);

  const loadHomepage = async () => {
    try {
      const res = await getHomepageStats();
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    navigate(`/routes?from=${from}&to=${to}`);
  };

  return (
    <>
      <section className="hero">
        <div className="overlay-dark"></div>
        <div className="hero-gradient"></div>

        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-badge">
              <Sparkles size={16} /> Intelligent Transport Platform
            </span>

            <h1>Smart Mobility Booking For Modern Campus Travel</h1>

            <p>
              Search live routes, reserve seats, rent vehicles and
              manage your complete transport experience through one premium digital platform.
            </p>

            <div className="stats-row">
              <div>
                <h2>{stats.totalRoutes}+</h2>
                <span>Active Routes</span>
              </div>
              <div>
                <h2>{stats.totalVehicles}+</h2>
                <span>Vehicles</span>
              </div>
              <div>
                <h2>{stats.schedules.length}+</h2>
                <span>Schedules</span>
              </div>
            </div>

            <div className="hero-buttons">
              <button onClick={() => navigate("/routes")}>
                Explore Routes <ArrowRight size={18}/>
              </button>
              <button className="secondary-btn" onClick={() => navigate("/rent")}>
                Rent Vehicle
              </button>
            </div>
          </div>

          <div className="hero-search-card">
            <h2><Search size={20}/> Quick Route Finder</h2>

            <input
              type="text"
              placeholder="Enter Starting Location"
              onChange={(e) => setFrom(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Destination"
              onChange={(e) => setTo(e.target.value)}
            />

            <button onClick={handleSearch}>Search Available Transport</button>
          </div>
        </div>
      </section>

      <section className="service-section">
        <h2>Powerful Smart Services</h2>
        <p className="section-sub">
          Designed to simplify route discovery, bookings and rental travel management.
        </p>

        <div className="service-grid">
          <div className="service-card">
            <Bus size={38}/>
            <h3>Live Route Finder</h3>
            <p>Discover active university transport routes in real time.</p>
          </div>

          <div className="service-card">
            <Clock3 size={38}/>
            <h3>Schedule Monitoring</h3>
            <p>Monitor departure and arrival schedules instantly.</p>
          </div>

          <div className="service-card">
            <Car size={38}/>
            <h3>Vehicle Rental Booking</h3>
            <p>Reserve buses, vans and cars for personal or group travel.</p>
          </div>

          <div className="service-card">
            <ShieldCheck size={38}/>
            <h3>Secure Confirmations</h3>
            <p>Reliable booking approvals with centralized admin verification.</p>
          </div>
        </div>
      </section>

      <section className="schedule-section">
        <h2>Today's Active Transport Schedules</h2>
        <p className="section-sub">Live university transport departures available now</p>

        <div className="schedule-grid">
          {stats.schedules.map((item) => (
            <div className="schedule-box" key={item._id}>
              <div className="schedule-route">
                <MapPinned size={20}/>
                <h3>{item.from} ➜ {item.to}</h3>
              </div>
              <p><Clock3 size={15}/> Departure: {item.departureTime}</p>
              <p><Clock3 size={15}/> Arrival: {item.arrivalTime}</p>
              <p>Fare: Rs. {item.price}</p>
              <span>{item.vehicle?.name || "Vehicle Pending"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Why Students Choose TransitPRO?</h2>
        <p>
          TransitPRO combines intelligent booking technology, live transport visibility,
          secure confirmations and rental convenience into one seamless university mobility ecosystem.
        </p>
        <button onClick={() => navigate("/routes")}>Start Booking Today</button>
      </section>
    </>
  );
}