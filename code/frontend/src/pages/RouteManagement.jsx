import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/routemanagement.css";

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    from: "",
    to: "",
    price: "",
    departureTime: "",
    arrivalTime: "",
    vehicle: "",
  });

  useEffect(() => {
    fetchRoutes();
    fetchVehicles();
  }, []);

  const fetchRoutes = async () => {
    const res = await axios.get("http://localhost:5001/api/routes");
    setRoutes(res.data);
  };

  const fetchVehicles = async () => {
    const res = await axios.get("http://localhost:5001/api/vehicles");
    setVehicles(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`http://localhost:5001/api/routes/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5001/api/routes", form);
    }

    setForm({
      from: "",
      to: "",
      price: "",
      departureTime: "",
      arrivalTime: "",
      vehicle: "",
    });

    fetchRoutes();
  };

  const handleEdit = (r) => {
    setForm({
      from: r.from,
      to: r.to,
      price: r.price,
      departureTime: r.departureTime,
      arrivalTime: r.arrivalTime,
      vehicle: r.vehicle?._id || "",
    });
    setEditId(r._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5001/api/routes/${id}`);
    fetchRoutes();
  };

  return (
    <div className="crud-page">
      <h1>Route Schedule Management</h1>

      <form className="route-form" onSubmit={handleSubmit}>
        <input placeholder="From" value={form.from} onChange={(e)=>setForm({...form,from:e.target.value})}/>
        <input placeholder="To" value={form.to} onChange={(e)=>setForm({...form,to:e.target.value})}/>
        <input placeholder="Ticket Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
        <input type="time" value={form.departureTime} onChange={(e)=>setForm({...form,departureTime:e.target.value})}/>
        <input type="time" value={form.arrivalTime} onChange={(e)=>setForm({...form,arrivalTime:e.target.value})}/>

        <select value={form.vehicle} onChange={(e)=>setForm({...form,vehicle:e.target.value})}>
          <option value="">Assign Vehicle</option>
          {vehicles.map((v)=>(
            <option key={v._id} value={v._id}>{v.name} - {v.type}</option>
          ))}
        </select>

        <button>{editId ? "Update Route" : "Add Route"}</button>
      </form>

      <div className="crud-table">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Price</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Vehicle</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((r)=>(
              <tr key={r._id}>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>Rs. {r.price}</td>
                <td>{r.departureTime}</td>
                <td>{r.arrivalTime}</td>
                <td>{r.vehicle ? r.vehicle.name : "Not Assigned"}</td>
                <td>
                  <button className="edit" onClick={()=>handleEdit(r)}>Edit</button>
                  <button className="delete" onClick={()=>handleDelete(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}