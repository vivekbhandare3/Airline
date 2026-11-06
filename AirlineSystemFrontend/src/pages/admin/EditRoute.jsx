import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

export default function EditRoute() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRoute = async () => {

            try {

                const { data } = await axios.get(
                    `http://localhost:8080/admin/routes/edit/${id}`,
                    {
                        withCredentials: true
                    }
                );

                setFormData(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load route."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchRoute();

    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/admin/routes/update",
                formData,
                {
                    withCredentials: true
                }
            );

            navigate("/admin/routes");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update route."
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
                {error || "Route not found."}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-lg">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Edit Route
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow border border-gray-200"
            >

                <div className="space-y-5">

                    <div>
                        <label className="block font-semibold mb-2">
                            Origin
                        </label>

                        <input
                            type="text"
                            value={formData.origin || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    origin: e.target.value
                                })
                            }
                            className="w-full border rounded px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Destination
                        </label>

                        <input
                            type="text"
                            value={formData.destination || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    destination: e.target.value
                                })
                            }
                            className="w-full border rounded px-4 py-2"
                            required
                        />
                    </div>

                </div>

                <div className="flex gap-4 mt-8">

                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
                    >
                        Update Route
                    </button>

                    <Link
                        to="/admin/routes"
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded text-center"
                    >
                        Cancel
                    </Link>

                </div>

            </form>

        </div>
    );

}