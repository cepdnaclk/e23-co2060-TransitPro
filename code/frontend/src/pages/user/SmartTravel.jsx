import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, BadgeDollarSign, BrainCircuit, BusFront, Clock3, GitCompareArrows, MapPinned, Sparkles, Users } from "lucide-react";
import "../../styles/user/smartTravel.css";

const durationMinutes = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let a = sh * 60 + sm;
  let b = eh * 60 + em;
  if (b < a) b += 24 * 60;
  return b - a;
};

export default function SmartTravel() {
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState("recommend");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5001/api/routes").then((res) => setRoutes(res.data)).catch(() => {});
  }, []);

  const matches = useMemo(() => routes.filter((r) =>
    (!from || r.from.toLowerCase().includes(from.toLowerCase())) &&
    (!to || r.to.toLowerCase().includes(to.toLowerCase()))
  ), [routes, from, to]);

  const recommended = useMemo(() => {
    return [...matches].sort((a, b) => {
      const score = (r) => {
        const duration = durationMinutes(r.departureTime, r.arrivalTime) || 1;
        const fare = Number(r.price) || 0;
        const capacity = Number(r.vehicle?.seats) || 40;
        return fare * 0.55 + duration * 0.3 - capacity * 0.15;
      };
      return score(a) - score(b);
    }).slice(0, 5);
  }, [matches]);

  const toggleCompare = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const comparison = routes.filter((r) => selected.includes(r._id));

  return (
    <div className="smart-page">
      <section className="smart-hero">
        <span><Sparkles size={16}/> Intelligent travel assistant</span>
        <h1>Choose transport with confidence</h1>
        <p>TransitPRO analyzes fare, journey time and vehicle capacity to surface practical route options. You can also compare up to three routes side by side.</p>
        <div className="smart-search">
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From e.g. Kandy" />
          <ArrowRight size={20}/>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To e.g. Peradeniya" />
        </div>
        <div className="smart-tabs">
          <button className={mode === "recommend" ? "active" : ""} onClick={() => setMode("recommend")}><BrainCircuit size={17}/> Smart Recommendation</button>
          <button className={mode === "compare" ? "active" : ""} onClick={() => setMode("compare")}><GitCompareArrows size={17}/> Compare Routes</button>
        </div>
      </section>

      {mode === "recommend" ? (
        <section className="smart-content">
          <div className="smart-section-title"><h2>Recommended options</h2><span>{recommended.length} matches</span></div>
          <div className="smart-grid">
            {recommended.map((r, index) => {
              const duration = durationMinutes(r.departureTime, r.arrivalTime);
              return <article className="smart-card" key={r._id}>
                {index === 0 && <div className="recommend-badge"><Sparkles size={14}/> Recommended</div>}
                <div className="smart-card-top"><div className="smart-icon"><BusFront/></div><strong>Rs. {r.price}</strong></div>
                <h3>{r.from} <ArrowRight size={16}/> {r.to}</h3>
                <div className="smart-meta"><span><Clock3/> {duration || "--"} min</span><span><Users/> {r.vehicle?.seats || "--"} seats</span></div>
                <p className="why"><Sparkles size={15}/> Balanced fare, duration and available capacity.</p>
                <button onClick={() => navigate(`/book/${r._id}`)}>Book this route <ArrowRight size={16}/></button>
              </article>;
            })}
          </div>
          {!recommended.length && <div className="smart-empty">Enter a starting point and destination, or clear the fields to see all routes.</div>}
        </section>
      ) : (
        <section className="smart-content">
          <div className="smart-section-title"><h2>Route comparison</h2><span>{selected.length}/3 selected</span></div>
          <div className="compare-pick-grid">
            {matches.map((r) => <button key={r._id} className={`compare-pick ${selected.includes(r._id) ? "selected" : ""}`} onClick={() => toggleCompare(r._id)}>
              <strong>{r.from} → {r.to}</strong><span>Rs. {r.price} · {r.departureTime}</span>
            </button>)}
          </div>
          {comparison.length > 0 ? <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>Feature</th>{comparison.map(r => <th key={r._id}>{r.from} → {r.to}</th>)}</tr></thead><tbody>
            <tr><td>Fare</td>{comparison.map(r => <td key={r._id}><BadgeDollarSign/> Rs. {r.price}</td>)}</tr>
            <tr><td>Departure</td>{comparison.map(r => <td key={r._id}>{r.departureTime}</td>)}</tr>
            <tr><td>Arrival</td>{comparison.map(r => <td key={r._id}>{r.arrivalTime}</td>)}</tr>
            <tr><td>Duration</td>{comparison.map(r => <td key={r._id}><Clock3/> {durationMinutes(r.departureTime, r.arrivalTime)} min</td>)}</tr>
            <tr><td>Vehicle</td>{comparison.map(r => <td key={r._id}>{r.vehicle?.name || "Not assigned"}</td>)}</tr>
            <tr><td>Capacity</td>{comparison.map(r => <td key={r._id}><Users/> {r.vehicle?.seats || "--"}</td>)}</tr>
            <tr><td></td>{comparison.map(r => <td key={r._id}><button className="compare-book" onClick={() => navigate(`/book/${r._id}`)}>Book</button></td>)}</tr>
          </tbody></table></div> : <div className="smart-empty">Select up to three routes above to compare them.</div>}
        </section>
      )}
    </div>
  );
}
