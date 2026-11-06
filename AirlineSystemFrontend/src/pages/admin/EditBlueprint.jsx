import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditBlueprint() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            try {

                const { data } = await axios.get(
                    `http://localhost:8080/admin/blueprints/edit/${id}`,
                    {
                        withCredentials: true
                    }
                );

                setFormData(data.blueprint);
                setAirlines(data.airlines);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load blueprint."
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
                "http://localhost:8080/admin/blueprints/update",
                formData,
                {
                    withCredentials: true
                }
            );

            navigate("/admin/blueprints");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update blueprint."
            );

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
                {error || "Blueprint not found."}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-lg">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Edit Flight Blueprint
            </h2>

            {error && (
                <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
            >

                <div className="space-y-4">

                    <div>

                        <label className="block text-sm text-gray-600 mb-1">
                            Airline
                        </label>

                        <select
                            value={formData.airline?.id || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    airline: {
                                        id: e.target.value
                                    }
                                })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        >
                            {airlines.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div>

                        <label className="block text-sm text-gray-600 mb-1">
                            Aircraft Model
                        </label>

                        <input
                            type="text"
                            value={formData.aircraftModel}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    aircraftModel: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />

                    </div>

                    <div>

                        <label className="block text-sm text-gray-600 mb-1">
                            Economy Seats
                        </label>

                        <input
                            type="number"
                            value={formData.economySeats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    economySeats: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />

                    </div>

                    <div>

                        <label className="block text-sm text-gray-600 mb-1">
                            Business Seats
                        </label>

                        <input
                            type="number"
                            value={formData.businessSeats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    businessSeats: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />

                    </div>

                </div>

                <div className="mt-6 flex gap-3">

                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                    >
                        Update Blueprint
                    </button>

                    <Link
                        to="/admin/blueprints"
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded text-center"
                    >
                        Cancel
                    </Link>

                </div>

            </form>

        </div>
    );
}