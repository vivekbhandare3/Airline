
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLogin() {

    const navigate = useNavigate();

    const { setAuthenticatedUser } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:8080/admin/login",
                credentials,
                {
                    withCredentials: true
                }
            );

            const { username, role } = response.data;

            // Update React authentication state
            setAuthenticatedUser({
                username,
                role,
                accountType: "ADMIN"
            });

            // Redirect to admin dashboard
            navigate("/admin/dashboard");

        } catch (err) {

            console.error("Admin login error:", err);

            setError(
                err.response?.data?.message ||
                "Invalid admin username or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-10">

            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-t-4 border-yellow-500">

                <div className="text-center mb-6">

                    <h3 className="text-2xl font-bold text-gray-800">
                        🛡️ Admin Access
                    </h3>

                </div>

                {error && (

                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
                        {error}
                    </div>

                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-800 hover:bg-black disabled:bg-gray-500 text-white font-bold py-3 rounded-md transition"
                    >
                        {loading ? "Authenticating..." : "Authenticate"}
                    </button>

                </form>

                <div className="text-center mt-6 pt-4 border-t">

                    <Link
                        to="/login"
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                        Return to Standard User Login
                    </Link>

                </div>

            </div>

        </div>

    );
}
