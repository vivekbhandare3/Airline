import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageAirlines() {

    const [airlines, setAirlines] = useState([]);

    const [newAirline, setNewAirline] = useState({
        name: "",
        code: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAirlines = async () => {

        try {

            const { data } = await axios.get(
                "http://localhost:8080/admin/airlines",
                {
                    withCredentials: true
                }
            );

            setAirlines(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load airlines."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchAirlines();
    }, []);

    const handleAdd = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:8080/admin/airlines/add",
                newAirline,
                {
                    withCredentials: true
                }
            );

            setNewAirline({
                name: "",
                code: ""
            });

            fetchAirlines();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to add airline."
            );

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this airline?")) return;

        try {

            await axios.post(
                `http://localhost:8080/admin/airlines/delete/${id}`,
                {},
                {
                    withCredentials: true
                }
            );

            setAirlines((prev) =>
                prev.filter((a) => a.id !== id)
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to delete airline."
            );

        }

    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Manage Airlines
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
                    placeholder="Airline Name"
                    value={newAirline.name}
                    onChange={(e) =>
                        setNewAirline({
                            ...newAirline,
                            name: e.target.value
                        })
                    }
                    className="flex-1 border rounded px-4 py-2"
                    required
                />

                <input
                    type="text"
                    placeholder="Airline Code"
                    value={newAirline.code}
                    onChange={(e) =>
                        setNewAirline({
                            ...newAirline,
                            code: e.target.value
                        })
                    }
                    className="flex-1 border rounded px-4 py-2"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded"
                >
                    Add Airline
                </button>

            </form>

            {loading ? (

                <div className="text-center py-10">
                    Loading airlines...
                </div>

            ) : (

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-4 text-left">Code</th>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-center">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {airlines.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="3"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No airlines found.
                                    </td>
                                </tr>

                            ) : (

                                airlines.map((a) => (

                                    <tr
                                        key={a.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            {a.code}
                                        </td>

                                        <td className="p-4 font-semibold">
                                            {a.name}
                                        </td>

                                        <td className="p-4 text-center">

                                            <button
                                                onClick={() =>
                                                    handleDelete(a.id)
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                            >
                                                Delete
                                            </button>

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