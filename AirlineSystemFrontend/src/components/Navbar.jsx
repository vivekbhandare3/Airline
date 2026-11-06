import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {

    const { user, logout, isAuthenticated } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-gray-900 text-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                <Link
                    to="/index"
                    className="text-xl font-bold flex items-center"
                >
                    <span className="mr-2">✈️</span>
                    MAK Airlines
                </Link>

                <div className="flex items-center space-x-6">

                    {/* Both Admins and Super Admins get the Dashboard */}
                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                        <Link
                            to="/admin/dashboard"
                            className="text-yellow-400 hover:text-yellow-300 transition"
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* ONLY Super Admins get the Add Admin button */}
                    {user?.role === "SUPER_ADMIN" && (
                        <Link
                            to="/admin/registerAdmin"
                            className="text-purple-400 hover:text-purple-300 transition font-semibold"
                        >
                            🛡️ Add New Admin
                        </Link>
                    )}

                    {/* Standard User Links */}
                    {isAuthenticated && user?.role === "USER" && (
                        <Link
                            to="/user/profile"
                            className="text-gray-300 hover:text-white transition"
                        >
                            My Bookings
                        </Link>
                    )}

                    {isAuthenticated && (
                        <span className="text-gray-400">
                            Hello,&nbsp;
                            <span className="text-white font-semibold">
                                {user?.username}
                            </span>
                        </span>
                    )}

                    {isAuthenticated ? (
                        <button
                            onClick={async () => {
                                await handleLogout();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition"
                        >
                            Login
                        </Link>
                    )}

                </div>

            </div>
        </nav>
    );
}