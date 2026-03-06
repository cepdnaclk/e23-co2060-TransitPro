import { useState } from "react";
import "../../styles/user/home.css";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const search = () => {
    if (!from || !to) return alert("Select both locations");
    alert(`Search routes from ${from} to ${to}`);
  };

  return (
    <div className="home-container">
      <h1>Find Your Route</h1>

      <div className="search-box">
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <button onClick={search}>Search</button>
      </div>
    </div>
  );
}
