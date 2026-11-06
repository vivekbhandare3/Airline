import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManageFlights() {

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFlights = async () => {

        try {

            const { data } = await axios.get(
                "http://localhost:8080/admin/manage/flights",
                {
                    withCredentials: true
                }
            );

            setFlights(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load flights."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this flight?")) return;

        try {

            await axios.post(
                `http://localhost:8080/admin/manage/flights/delete/${id}`,
                {},
                {
                    withCredentials: true
                }
            );

            setFlights((prev) =>
                prev.filter((f) => f.id !== id)
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to delete flight."
            );

        }

    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-7xl">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold text-gray-800">
                    Manage Flights
                </h2>

                <Link
                    to="/admin/manage/flights/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                >
                    + Add Flight
                </Link>

            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (

                <div className="text-center py-10">
                    Loading flights...
                </div>

            ) : (

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>
                                <th className="p-4 text-left">Airline</th>
                                <th className="p-4 text-left">Route</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Economy (₹)</th>
                                <th className="p-4 text-center">Business (₹)</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {flights.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No flights available.
                                    </td>
                                </tr>

                            ) : (

                                flights.map((flight) => (

                                    <tr
                                        key={flight.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            {flight.airline?.name}
                                        </td>

                                        <td className="p-4">
                                            {flight.route?.origin} → {flight.route?.destination}
                                        </td>

                                        <td className="p-4 text-center">

                                            <span
                                                className={`px-2 py-1 rounded text-xs font-bold ${
                                                    flight.status === "Cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {flight.status}
                                            </span>

                                        </td>

                                        <td className="p-4 text-center">
                                            ₹{flight.economyPrice}
                                        </td>

                                        <td className="p-4 text-center">
                                            ₹{flight.businessPrice}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex flex-wrap justify-center gap-2">

                                                <Link
                                                    to={`/admin/manage/flights/edit/${flight.id}`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(flight.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>

                                                <Link
                                                    to={`/admin/manage/flights/view/${flight.id}`}
                                                    className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    👥 Passengers
                                                </Link>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );

}