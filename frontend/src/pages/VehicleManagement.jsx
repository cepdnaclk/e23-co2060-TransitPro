// src/pages/VehicleManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/vehiclemanagement.css"; // path -> src/styles/vehiclemanagement.css

export default function VehicleManagement(){
  const API = "http://localhost:5001/api/vehicles";
  const [vehicles,setVehicles] = useState([]);
  const [query,setQuery] = useState("");
  const [form,setForm] = useState({ type:"", number:"", seats:"" });
  const [editing,setEditing] = useState(null);

  useEffect(()=>{ load(); },[]);
  const load = async ()=>{ try{ const r=await axios.get(API); setVehicles(Array.isArray(r.data)?r.data:[]);}catch(e){console.error(e);} };

  const add = async ()=>{
    if(!form.type||!form.number||!form.seats) return alert("Fill fields");
    try{ await axios.post(API, form); setForm({type:"",number:"",seats:""}); load(); }catch(e){ alert(e.response?.data?.error||"Add failed"); }
  };

  const startEdit = (v)=>{ setEditing(v._id); setForm({type:v.type, number:v.number, seats:v.seats}); window.scrollTo({top:0, behavior:'smooth'}); };
  const save = async ()=>{ try{ await axios.put(`${API}/${editing}`, form); setEditing(null); setForm({type:"",number:"",seats:""}); load(); }catch(e){ alert("Update failed"); } };
  const remove = async (id)=>{ if(!confirm("Delete?")) return; await axios.delete(`${API}/${id}`); load(); };

  const filtered = vehicles.filter(v => `${v.type} ${v.number}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="vehicle-page-wide">
      <h1>Vehicle Management</h1>

      <div className="vm-top">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by type or number..." className="vm-search" />
      </div>

      <div className="vm-form-card">
        <h3>{editing? "Edit Vehicle" : "Add New Vehicle"}</h3>
        <div className="vm-form-grid">
          <input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Type (Bus/Van/Car)" />
          <input value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="Number (NC-1234)" />
          <input value={form.seats} type="number" onChange={e=>setForm({...form,seats:e.target.value})} placeholder="Seats" />
          <div className="vm-form-actions">
            {!editing ? <button className="btn add" onClick={add}>Add Vehicle</button> : <button className="btn save" onClick={save}>Save</button>}
            <button className="btn cancel" onClick={()=>{ setForm({type:"",number:"",seats:""}); setEditing(null); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="vm-table-card">
        <table className="vm-table">
          <colgroup><col style={{width:'22%'}}/><col style={{width:'48%'}}/><col style={{width:'12%'}}/><col style={{width:'18%'}}/></colgroup>
          <thead><tr><th>Type</th><th>Number</th><th>Seats</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan="4" style={{padding:16,textAlign:'center'}}>No vehicles</td></tr> :
              filtered.map(v=>(
                <tr key={v._id}>
                  <td>{v.type}</td>
                  <td>{v.number}</td>
                  <td style={{textAlign:'center'}}>{v.seats}</td>
                  <td style={{textAlign:'center'}}>
                    <button className="btn edit" onClick={()=>startEdit(v)}>Edit</button>
                    <button className="btn del" onClick={()=>remove(v._id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
