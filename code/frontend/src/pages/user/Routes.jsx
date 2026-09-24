import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  MapPinned,
  Clock3,
  BusFront,
  ArrowRight,
  Search,
  Route as RouteIcon,
} from "lucide-react";
import "../../styles/user/userRoutes.css";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const fromQuery = query.get("from")?.trim().toLowerCase() || "";
  const toQuery = query.get("to")?.trim().toLowerCase() || "";

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/routes")
      .then((res) => {
        setRoutes(res.data);

        let filtered = res.data;

        if (fromQuery) {
          filtered = filtered.filter((route) =>
            route.from.toLowerCase().includes(fromQuery)
          );
        }

        if (toQuery) {
          filtered = filtered.filter((route) =>
            route.to.toLowerCase().includes(toQuery)
          );
        }

        setFilteredRoutes(filtered);
        setFromSearch(fromQuery);
        setToSearch(toQuery);
      })
      .catch((err) => console.log(err));
  }, [fromQuery, toQuery]);

  const handleBook = (id) => {
    navigate(`/book/${id}`);
  };

  const handleManualSearch = () => {
    let filtered = routes;

    if (fromSearch.trim()) {
      filtered = filtered.filter((route) =>
        route.from.toLowerCase().includes(fromSearch.toLowerCase())
      );
    }

    if (toSearch.trim()) {
      filtered = filtered.filter((route) =>
        route.to.toLowerCase().includes(toSearch.toLowerCase())
      );
    }

    setFilteredRoutes(filtered);
  };

  return (
    <div className="routes-page">
      <div className="routes-hero">
        <span><Search size={15}/> Live Route Discovery Center</span>
        <h1>Find Your Available Smart Transport Route</h1>
        <p>
          Browse university travel departures, compare schedules and reserve your
          seat instantly through TransitPRO.
        </p>

        <div className="route-search-panel">
          <input
            type="text"
            placeholder="Search Pickup Location"
            value={fromSearch}
            onChange={(e) => setFromSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search Destination"
            value={toSearch}
            onChange={(e) => setToSearch(e.target.value)}
          />

          <button onClick={handleManualSearch}>Search Routes</button>
        </div>

        <div className="route-count">
          <RouteIcon size={18}/> {filteredRoutes.length} Routes Available
        </div>
      </div>

      <div className="routes-grid">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => (
            <div className="route-box" key={route._id}>
              <div className="route-top">
                <div className="route-icon">
                  <BusFront size={20} />
                </div>
                <div className="fare-badge">Rs. {route.price}</div>
              </div>

              <h2>
                {route.from} <ArrowRight size={18}/> {route.to}
              </h2>

              <div className="route-info">
                <p><Clock3 size={16}/> Departure: {route.departureTime}</p>
                <p><Clock3 size={16}/> Arrival: {route.arrivalTime}</p>
                <p><MapPinned size={16}/> Vehicle: {route.vehicle?.name || "Pending Assignment"}</p>
              </div>

              <button onClick={() => handleBook(route._id)}>
                Reserve This Route
              </button>
            </div>
          ))
        ) : (
          <div className="empty-route-box">
            <Search size={48}/>
            <h3>No Matching Routes Available</h3>
            <p>Try changing pickup or destination to discover more transport schedules.</p>
          </div>
        )}
      </div>
    </div>
  );
}