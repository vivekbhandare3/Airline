import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManageBlueprints() {

    const [blueprints, setBlueprints] = useState([]);
    const [airlines, setAirlines] = useState([]);

    const [newBlueprint, setNewBlueprint] = useState({
        airline: {
            id: ""
        },
        aircraftModel: "",
        economySeats: "",
        businessSeats: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {

        try {

            const [blueprintsRes, airlinesRes] = await Promise.all([

                axios.get(
                    "http://localhost:8080/admin/blueprints",
                    {
                        withCredentials: true
                    }
                ),

                axios.get(
                    "http://localhost:8080/admin/airlines",
                    {
                        withCredentials: true
                    }
                )

            ]);

            setBlueprints(blueprintsRes.data);
            setAirlines(airlinesRes.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load data."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/admin/blueprints/add",
                newBlueprint,
                {
                    withCredentials: true
                }
            );

            setNewBlueprint({
                airline: {
                    id: ""
                },
                aircraftModel: "",
                economySeats: "",
                businessSeats: ""
            });

            fetchData();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to add blueprint."
            );

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this blueprint?")) return;

        try {

            await axios.post(
                `http://localhost:8080/admin/blueprints/delete/${id}`,
                {},
                {
                    withCredentials: true
                }
            );

            setBlueprints((prev) =>
                prev.filter((b) => b.id !== id)
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to delete blueprint."
            );

        }

    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Manage Flight Blueprints
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleAdd}
                className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200 mb-8"
            >

                <h4 className="font-bold text-lg mb-5">
                    Add New Blueprint
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div>
                        <label className="block font-semibold mb-2">
                            Airline
                        </label>

                        <select
                            value={newBlueprint.airline.id}
                            onChange={(e) =>
                                setNewBlueprint({
                                    ...newBlueprint,
                                    airline: {
                                        id: e.target.value
                                    }
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">
                                Select Airline
                            </option>

                            {airlines.map((a) => (
                                <option
                                    key={a.id}
                                    value={a.id}
                                >
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Aircraft Model
                        </label>

                        <input
                            type="text"
                            value={newBlueprint.aircraftModel}
                            onChange={(e) =>
                                setNewBlueprint({
                                    ...newBlueprint,
                                    aircraftModel: e.target.value
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            placeholder="Boeing 737"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Economy Seats
                        </label>

                        <input
                            type="number"
                            value={newBlueprint.economySeats}
                            onChange={(e) =>
                                setNewBlueprint({
                                    ...newBlueprint,
                                    economySeats: e.target.value
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Business Seats
                        </label>

                        <input
                            type="number"
                            value={newBlueprint.businessSeats}
                            onChange={(e) =>
                                setNewBlueprint({
                                    ...newBlueprint,
                                    businessSeats: e.target.value
                                })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                </div>

                <button
                    type="submit"
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded"
                >
                    Add Blueprint
                </button>

            </form>

            {loading ? (

                <div className="text-center py-10">
                    Loading...
                </div>

            ) : (

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="p-4 text-left">Airline</th>
                                <th className="p-4 text-left">Aircraft</th>
                                <th className="p-4 text-center">Economy</th>
                                <th className="p-4 text-center">Business</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {blueprints.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No blueprints found.
                                    </td>
                                </tr>

                            ) : (

                                blueprints.map((b) => (

                                    <tr
                                        key={b.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            {b.airline?.name}
                                        </td>

                                        <td className="p-4">
                                            {b.aircraftModel}
                                        </td>

                                        <td className="p-4 text-center">
                                            {b.economySeats}
                                        </td>

                                        <td className="p-4 text-center">
                                            {b.businessSeats}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex justify-center gap-2">

                                                <Link
                                                    to={`/admin/blueprints/edit/${b.id}`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(b.id)
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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