import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard'; 
import ManageAirlines from './pages/admin/ManageAirlines';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageBlueprints from './pages/admin/ManageBlueprints';
import ManageFlights from './pages/admin/ManageFlights';
import ManageUsers from './pages/admin/ManageUsers';
import AddFlight from './pages/admin/AddFlight';
import EditFlight from './pages/admin/EditFlight';
import ViewPassengers from './pages/admin/ViewPassengers';
import FlightDetails from './pages/user/FlightDetails';
import PassengerDetails from './pages/booking/PassengerDetails';
import PaymentSelection from './pages/booking/PaymentSelection';
import Ticket from './pages/booking/Ticket';
import Profile from './pages/user/Profile';
export default function App() {
  return (
    <Router>
      <AuthProvider>

        <Navbar />

        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile/>}/>
            <Route path="/admin/login" element={<AdminLogin />} /> 
            <Route path="/admin/registerAdmin" element={<RegisterAdmin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/airlines" element={<ManageAirlines />} />
            <Route path="/admin/routes" element={<ManageRoutes />} />
            <Route path="/admin/blueprints" element={<ManageBlueprints />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/manage/flights" element={<ManageFlights />} />
            <Route path="/admin/manage/flights/add" element={<AddFlight />} />
            <Route path="/admin/manage/flights/edit/:id" element={<EditFlight />} />
            <Route path="/admin/manage/flights/view/:id" element={<ViewPassengers />} />
            <Route path="/book/:id" element={<FlightDetails />} />
            <Route path="/book/:id/passengers" element={<PassengerDetails />} />
            <Route path="/payment" element={<PaymentSelection />} />
            <Route path="/ticket/:bookingId" element={<Ticket />} />
          </Routes>
        </div>

      </AuthProvider>
    </Router>
  );
}