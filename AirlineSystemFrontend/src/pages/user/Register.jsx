import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {

            await axios.post(
                "http://localhost:8080/register/user",
                formData
            );

            setSuccess("Registration successful.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Registration failed."
            );

        }
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center py-10">

            <div className="w-full max-w-md bg-white rounded-lg shadow p-8">

                <h3 className="text-2xl font-bold text-center mb-6">
                    Register
                </h3>

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>

                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Already have an account? Login
                    </Link>
                </div>

            </div>

        </div>
    );
}