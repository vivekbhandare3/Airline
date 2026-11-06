
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(credentials);

            navigate("/index");

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Invalid username or password."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center py-10">

            <div className="w-full max-w-md bg-white rounded-lg shadow p-8">

                <h3 className="text-2xl font-bold text-center mb-6">
                    Login
                </h3>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />

                    {/* OAuth2 Login Buttons */}

                    <div className="flex flex-col gap-4 mt-6">

                        <a
                            href="http://localhost:8080/oauth2/authorization/google"
                            className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with Google
                        </a>

                        <a
                            href="http://localhost:8080/oauth2/authorization/github"
                            className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/512317/github-142.svg"
                                alt="GitHub"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with GitHub
                        </a>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 rounded-md transition"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <div className="text-center mt-4">

                    <Link
                        to="/user/register"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Don't have an account? Register
                    </Link>

                </div>

            </div>

        </div>
    );
}
