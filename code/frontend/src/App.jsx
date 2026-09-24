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
import RoutesPage from "./pages/user/Routes";
import BookTrip from "./pages/user/BookTrip";
import RentVehicle from "./pages/user/RentVehicle";
import BookingStatus from "./pages/user/BookingStatus";
import SmartTravel from "./pages/user/SmartTravel";
import Notifications from "./pages/user/Notifications";
import TripManifest from "./pages/admin/TripManifest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<UserRoutes />} />
          <Route path="/routes/search" element={<RoutesPage />} />
          <Route path="/book/:id" element={<BookTrip />} />
          <Route path="/rent" element={<RentVehicle />} />
          <Route path="/status" element={<BookingStatus />} />
          <Route path="/smart-travel" element={<SmartTravel />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="/login" element={<Login />} />

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
          <Route path="manifest" element={<TripManifest />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}