import axios from "axios";

const API = "http://localhost:5001/api/routes";

export const getHomepageStats = () => axios.get(`${API}/homepage/stats`);
export const searchRoutes = () => axios.get(API);