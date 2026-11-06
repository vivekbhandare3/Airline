import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {

    const { user, loading, isAuthenticated } = useContext(AuthContext);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    console.log("Dashboard user:", user);
    console.log("Authenticated:", isAuthenticated);

    if (
        !isAuthenticated ||
        !user ||
        !["ADMIN", "SUPER_ADMIN"].includes(user.role)
    ) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">

            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                Admin Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <Link to="/admin/airlines"
                    className="bg-blue-600 text-white p-6 rounded-xl text-center font-bold">
                    ✈️ Manage Airlines
                </Link>

                <Link to="/admin/routes"
                    className="bg-gray-600 text-white p-6 rounded-xl text-center font-bold">
                    🗺️ Manage Routes
                </Link>

                <Link to="/admin/blueprints"
                    className="bg-yellow-500 text-white p-6 rounded-xl text-center font-bold">
                    📋 Manage Blueprints
                </Link>

                <Link to="/admin/manage/flights"
                    className="bg-green-600 text-white p-6 rounded-xl text-center font-bold">
                    🛫 Manage Flights
                </Link>

                <Link to="/admin/users"
                    className="bg-teal-600 text-white p-6 rounded-xl text-center font-bold">
                    👥 Manage Users
                </Link>

            </div>

        </div>
    );
}