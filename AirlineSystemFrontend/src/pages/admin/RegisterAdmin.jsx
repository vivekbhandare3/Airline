import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function RegisterAdmin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:8080/admin/registerAdmin",
                formData,
                {
                    withCredentials: true,
                }
            );

            navigate("/login");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Admin registration failed."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

                <div className="bg-gray-800 p-6 text-center text-white">
                    <h2 className="text-2xl font-bold">
                        🛡️ Admin Signup
                    </h2>
                </div>

                <div className="p-8">

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>

                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 rounded-md"
                        >
                            Create Admin Account
                        </button>

                    </form>

                    <div className="text-center mt-6">
                        <Link
                            to="/login"
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}