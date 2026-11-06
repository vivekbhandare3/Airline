import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

export default function EditFlight() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);

    const [options, setOptions] = useState({
        airlines: [],
        routes: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            try {

                const { data } = await axios.get(
                    `http://localhost:8080/admin/manage/flights/edit/${id}`,
                    {
                        withCredentials: true
                    }
                );

                setFormData(data.flight);

                setOptions({
                    airlines: data.airlines,
                    routes: data.routes
                });

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load flight."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/admin/manage/flights/update",
                formData,
                {
                    withCredentials: true
                }
            );

            navigate("/admin/manage/flights");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update flight."
            );

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "airline.id") {

            setFormData({
                ...formData,
                airline: {
                    id: value
                }
            });

        } else if (name === "route.id") {

            setFormData({
                ...formData,
                route: {
                    id: value
                }
            });

        } else {

            setFormData({
                ...formData,
                [name]: value
            });

        }

    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading...
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="text-center py-20 text-red-600">
                {error || "Flight not found."}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border border-gray-200">

                <div className="bg-yellow-500 text-black p-4 rounded-t-xl">
                    <h2 className="text-2xl font-bold">
                        Edit Flight
                    </h2>
                </div>

                {error && (
                    <div className="m-4 bg-red-100 text-red-700 p-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block font-semibold mb-2">
                                Airline
                            </label>

                            <select
                                name="airline.id"
                                value={formData.airline?.id || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                {options.airlines.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Route
                            </label>

                            <select
                                name="route.id"
                                value={formData.route?.id || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                {options.routes.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.origin} → {r.destination}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Departure Date
                            </label>

                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Departure Time
                            </label>

                            <input
                                type="time"
                                name="departureTime"
                                value={formData.departureTime || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Arrival Date
                            </label>

                            <input
                                type="date"
                                name="arrivalDate"
                                value={formData.arrivalDate || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Arrival Time
                            </label>

                            <input
                                type="time"
                                name="arrivalTime"
                                value={formData.arrivalTime || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Economy Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="economyPrice"
                                value={formData.economyPrice || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Business Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="businessPrice"
                                value={formData.businessPrice || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-2">
                                Flight Status
                            </label>

                            <select
                                name="status"
                                value={formData.status || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Scheduled">
                                    Scheduled
                                </option>

                                <option value="Delayed">
                                    Delayed
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end gap-4">

                        <Link
                            to="/admin/manage/flights"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded"
                        >
                            Update Flight
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );

}