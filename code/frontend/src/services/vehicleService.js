import axios from "axios";

const API = "http://localhost:5001/api/vehicles";

// Get all vehicles
export const getVehicles = async () => {
  return await axios.get(API);
};

// Add vehicle
export const createVehicle = async (vehicleData) => {
  return await axios.post(API, vehicleData);
};

// Update vehicle
export const updateVehicle = async (id, vehicleData) => {
  return await axios.put(`${API}/${id}`, vehicleData);
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  return await axios.delete(`${API}/${id}`);
};