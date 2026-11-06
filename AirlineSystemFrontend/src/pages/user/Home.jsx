import React, { useState } from "react";
import { Link } from "react-router-dom"; // Added for Book button
import axios from "axios"; // Added for API call

export default function Home() {
    const [searchParams, setSearchParams] = useState({
        origin: "",
        destination: "",
        date: "",
        passengers: 1,
    });

    // NEW STATES for handling the search results
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleChange = (e) => {
        setSearchParams((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // UPDATED handleSearch to fetch data instead of changing the page
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setHasSearched(true);

        try {
            const response = await axios.get("http://localhost:8080/search", {
                params: {
                    origin: searchParams.origin,
                    destination: searchParams.destination,
                    date: searchParams.date,
                    passengers: searchParams.passengers,
                }
            });
            
            setFlights(response.data);
            
        } catch (err) {
            console.error(err);
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- YOUR ORIGINAL HEADER STYLING (UNCHANGED) --- */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-400 text-white py-16 text-center rounded-b-[50px] mb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">
                        Fly with Confidence
                    </h1>

                    <p className="text-xl opacity-90">
                        Search global destinations at the best prices
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl -mt-24 relative z-10 border border-gray-100">

                        {/* --- YOUR ORIGINAL FORM STYLING (UNCHANGED) --- */}
                        <form
                            onSubmit={handleSearch}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                        >

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                    From
                                </label>

                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="City"
                                    value={searchParams.origin}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                    To
                                </label>

                                <input
                                    type="text"
                                    name="destination"
                                    placeholder="City"
                                    value={searchParams.destination}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={searchParams.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                    Passengers
                                </label>

                                <div className="flex">
                                    <input
                                        type="number"
                                        name="passengers"
                                        min="1"
                                        max="9"
                                        value={searchParams.passengers}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-r-lg transition disabled:bg-blue-400"
                                    >
                                        {loading ? "..." : "Search"}
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </div>

            {/* --- NEW SECTION: SEARCH RESULTS --- */}
            <div className="container mx-auto px-4 mt-12 pb-16">
                
                {/* Error Message */}
                {error && (
                    <div className="max-w-5xl mx-auto bg-red-100 text-red-700 p-4 rounded-lg text-center font-bold mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-gray-600 text-xl font-semibold mt-10">
                        Searching for flights...
                    </div>
                )}

                {/* No Flights Found */}
                {!loading && hasSearched && flights.length === 0 && !error && (
                    <div className="text-center text-gray-600 text-xl font-semibold mt-10">
                        No flights found for this route on the selected date.
                    </div>
                )}

                {/* Flight Results List */}
                {!loading && flights.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
                        {flights.map((flight) => (
                            <div key={flight.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 transition hover:shadow-lg">
                                
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{flight.airline?.name}</h3>
                                    <p className="text-gray-600 text-lg">
                                        <span className="font-semibold text-gray-800">{flight.route?.origin}</span> 
                                        <span className="mx-3 text-blue-400">✈️</span> 
                                        <span className="font-semibold text-gray-800">{flight.route?.destination}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Status: <span className="font-semibold text-green-600">{flight.status}</span> 
                                        <span className="mx-2">|</span> 
                                        Available Seats: {flight.availableEconomySeats}
                                    </p>
                                </div>

                                <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                    <p className="text-3xl font-bold text-blue-600 mb-4">₹{flight.economyPrice}</p>
                                    
                                    <Link
                                        to={`/book/${flight.id}`}
                                        state={{ passengersCount: searchParams.passengers }}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition inline-block shadow-sm"
                                    >
                                        Book Now
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}