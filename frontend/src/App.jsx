import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/AdminHome";
import VehicleManagement from "./pages/VehicleManagement";
import RoutesManagement from "./pages/RouteManagement";
import BookingManagement from "./pages/BookingManagement";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import UserLayout from "./pages/user/UserLayout";
import Home from "./pages/user/Home";
import UserRoutes from "./pages/user/UserRoutes";
import RouteDetails from "./pages/user/RouteDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC USER SIDE ================= */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<UserRoutes />} />
          <Route path="/routes/:id" element={<RouteDetails />} />
        </Route>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN SIDE ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="routes" element={<RoutesManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
