import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AddFlight() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        airline: { id: '' },
        route: { id: '' },
        flightBlueprint: { id: '' },
        departureDate: '',
        departureTime: '',
        arrivalDate: '',
        arrivalTime: '',
        economyPrice: '',
        businessPrice: '',
        status: 'Scheduled'
    });

    const [options, setOptions] = useState({
        airlines: [],
        routes: [],
        blueprints: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:8080/admin/manage/flights/form-data",
                    {
                        withCredentials: true
                    }
                );

                setOptions(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load form data.");
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Extract the blueprint ID from the form data
            const blueprintId = formData.flightBlueprint.id || formData.flightBlueprint;

            // Attach the blueprintId directly to the URL as a query parameter
            await axios.post(
                `http://localhost:8080/admin/manage/flights/add?flightBlueprintId=${blueprintId}`,
                formData,
                {
                    withCredentials: true
                }
            );

            // Redirect back to the flights table on success
            navigate("/admin/manage/flights");

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add flight."
            );
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "airline.id") {
            setFormData(prev => ({
                ...prev,
                airline: {
                    id: value
                }
            }));
        }
        else if (name === "route.id") {
            setFormData(prev => ({
                ...prev,
                route: {
                    id: value
                }
            }));
        }
        else if (name === "flightBlueprint.id") {
            setFormData(prev => ({
                ...prev,
                flightBlueprint: { id: value }
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">

                <div className="bg-blue-600 p-4 rounded-t-xl text-white">
                    <h4 className="text-xl font-bold">
                        Add New Flight
                    </h4>
                </div>

                {error && (
                    <div className="m-6 bg-red-100 text-red-700 p-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Airline
                            </label>

                            <select
                                name="airline.id"
                                value={formData.airline.id}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Airline</option>

                                {options.airlines.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Route
                            </label>

                            <select
                                name="route.id"
                                value={formData.route.id}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Route</option>

                                {options.routes.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.origin} → {r.destination}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">
                                Aircraft
                            </label>

                            <select
                                name="flightBlueprint.id" // <-- Change this
                                value={formData.flightBlueprint.id} // <-- Change this
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Aircraft</option>

                                {options.blueprints.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.aircraftModel} ({b.airline?.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Departure Date
                            </label>

                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Departure Time
                            </label>

                            <input
                                type="time"
                                name="departureTime"
                                value={formData.departureTime}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Arrival Date
                            </label>

                            <input
                                type="date"
                                name="arrivalDate"
                                value={formData.arrivalDate}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Arrival Time
                            </label>

                            <input
                                type="time"
                                name="arrivalTime"
                                value={formData.arrivalTime}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Economy Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="economyPrice"
                                value={formData.economyPrice}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Business Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="businessPrice"
                                value={formData.businessPrice}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Cancelled">Cancelled</option>
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
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
                        >
                            Save Flight
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}