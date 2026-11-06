import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManageRoutes() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newRoute, setNewRoute] = useState({
        origin: "",
        destination: "",
    });

    const fetchRoutes = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:8080/admin/routes",
                {
                    withCredentials: true,
                }
            );

            setRoutes(data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Failed to load routes."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:8080/admin/routes/add",
                newRoute,
                {
                    withCredentials: true,
                }
            );

            setNewRoute({
                origin: "",
                destination: "",
            });

            fetchRoutes();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to add route."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this route?")) return;

        try {
            await axios.post(
                `http://localhost:8080/admin/routes/delete/${id}`,
                {},
                {
                    withCredentials: true,
                }
            );

            setRoutes((prev) =>
                prev.filter((route) => route.id !== id)
            );
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to delete route."
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Manage Routes
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleAdd}
                className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8 flex flex-col md:flex-row gap-4"
            >
                <input
                    type="text"
                    placeholder="Origin City"
                    value={newRoute.origin}
                    onChange={(e) =>
                        setNewRoute({
                            ...newRoute,
                            origin: e.target.value,
                        })
                    }
                    className="flex-1 border border-gray-300 rounded px-4 py-2"
                    required
                />

                <input
                    type="text"
                    placeholder="Destination City"
                    value={newRoute.destination}
                    onChange={(e) =>
                        setNewRoute({
                            ...newRoute,
                            destination: e.target.value,
                        })
                    }
                    className="flex-1 border border-gray-300 rounded px-4 py-2"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded"
                >
                    Add Route
                </button>
            </form>

            {loading ? (
                <div className="text-center py-10">
                    Loading routes...
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">
                                    Origin
                                </th>
                                <th className="p-4 text-left">
                                    Destination
                                </th>
                                <th className="p-4 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {routes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No routes found.
                                    </td>
                                </tr>
                            ) : (
                                routes.map((route) => (
                                    <tr
                                        key={route.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            {route.origin}
                                        </td>

                                        <td className="p-4">
                                            {route.destination}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/admin/routes/edit/${route.id}`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(route.id)
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
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