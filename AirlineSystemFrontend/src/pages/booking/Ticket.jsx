import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Ticket() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8080/ticket/${bookingId}`,
                    { withCredentials: true }
                );
                setTicketData(data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate("/login");
                } else {
                    setError(err.response?.data?.message || "Failed to load ticket.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [bookingId, navigate]);

    // --- HELPER FUNCTION: 1 Hour Before Departure ---
    const getBoardingTime = (departureTime) => {
        if (!departureTime) return "N/A";
        try {
            const parts = departureTime.split(":");
            let hours = parseInt(parts[0], 10) - 1;
            if (hours < 0) hours += 24; // Handle midnight wrap-around
            const minutes = parts[1];
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } catch (e) {
            return "N/A";
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-xl font-bold text-gray-600">Generating your boarding passes...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;
    }

    if (!ticketData) return <div className="text-center py-20">Ticket not found.</div>;

    // --- ROBUST DATA EXTRACTION ---
    // This guarantees the data is read correctly whether Spring Boot sends a Map or the raw Booking object
    const booking = ticketData.booking ? ticketData.booking : ticketData;
    const flight = ticketData.flight ? ticketData.flight : (booking.flight || {});
    
    const isBusiness = booking?.seatClass === "Business";

    // Fallback just in case passengers list is STILL empty
    const passengerList = booking?.passengers && booking.passengers.length > 0 
        ? booking.passengers 
        : [{ title: "", firstName: "Primary", lastName: "Passenger", gender: "N/A", dateOfBirth: "N/A" }];

    return (
        <div className="bg-gray-100 min-h-screen py-10 print:bg-white print:py-0">
            <div className="container mx-auto max-w-5xl px-4">

                <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg text-center mb-8 shadow-sm print:hidden">
                    <h3 className="text-xl font-bold">✅ Booking Confirmed!</h3>
                    <p>Your payment was successful and your tickets are ready.</p>
                </div>

                {passengerList.map((passenger, index) => {
                    
                    // --- DYNAMIC SEAT CALCULATION ---
                    // Generates a seat number that gets smaller for each subsequent passenger
                    const baseSeatNum = isBusiness 
                        ? (flight?.availableBusinessSeats || 20) 
                        : (flight?.availableEconomySeats || 60);
                    const assignedSeat = `${isBusiness ? 'B' : 'E'}-${baseSeatNum - index}`;

                    return (
                        <div 
                            key={passenger.id || index} 
                            className="bg-white rounded-xl shadow-lg mb-10 overflow-hidden border border-gray-200 flex flex-col md:flex-row print:shadow-none print:border-2 print:border-gray-800 print:mb-8"
                        >
                            {/* LEFT SECTION - MAIN BOARDING PASS */}
                            <div className="md:w-3/4 p-6 md:p-8 border-b md:border-b-0 md:border-r-2 border-dashed border-gray-300 relative">
                                
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <div>
                                        <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">
                                            {flight?.airline?.name || "MAK Airlines"}
                                        </h2>
                                        <p className="text-sm text-gray-500 font-bold tracking-widest mt-1">BOARDING PASS</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider ${isBusiness ? 'bg-gray-900 text-yellow-400' : 'bg-blue-100 text-blue-800'}`}>
                                            {booking?.seatClass || "Economy"} CLASS
                                        </span>
                                    </div>
                                </div>

                                {/* Passenger & Flight Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Passenger Name</p>
                                        <h3 className="text-xl font-bold text-gray-900 uppercase">
                                            {passenger.title} {passenger.firstName} {passenger.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 font-semibold">
                                            Gender: <span className="text-gray-800">{passenger.gender || "N/A"}</span> | DOB: <span className="text-gray-800">{passenger.dateOfBirth || "N/A"}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Flight No.</p>
                                        <h3 className="text-xl font-bold text-gray-900 uppercase">
                                            FL-{flight?.id || "N/A"}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">PNR / Booking Ref</p>
                                        <h3 className="text-xl font-bold text-gray-900 uppercase">
                                            {booking?.id || "N/A"}
                                        </h3>
                                    </div>
                                </div>

                                {/* Route & Times */}
                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-6 border">
                                    <div className="text-left w-1/3">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Origin</p>
                                        <h2 className="text-3xl font-black text-gray-800">{flight?.route?.origin || "N/A"}</h2>
                                        <p className="text-sm font-bold text-blue-600 mt-1">{flight?.departureDate || "N/A"}</p>
                                        <p className="text-xl font-bold text-gray-900">{flight?.departureTime || "N/A"}</p>
                                    </div>
                                    
                                    <div className="w-1/3 flex flex-col items-center">
                                        <p className="text-xs text-gray-400 font-bold mb-2 uppercase">{flight?.flightBlueprint?.aircraftModel || "Aircraft"}</p>
                                        <div className="w-full border-t-2 border-gray-300 relative">
                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-2xl">
                                                ✈️
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">{isBusiness ? '40kg' : '15kg'} Baggage</p>
                                    </div>

                                    <div className="text-right w-1/3">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Destination</p>
                                        <h2 className="text-3xl font-black text-gray-800">{flight?.route?.destination || "N/A"}</h2>
                                        <p className="text-sm font-bold text-blue-600 mt-1">{flight?.arrivalDate || "N/A"}</p>
                                        <p className="text-xl font-bold text-gray-900">{flight?.arrivalTime || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Boarding Details */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 border border-blue-100 p-3 rounded text-center">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Gate</p>
                                        <h3 className="text-2xl font-bold text-blue-800">G-14</h3>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 p-3 rounded text-center">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Boarding Time</p>
                                        <h3 className="text-2xl font-bold text-blue-800">
                                            {getBoardingTime(flight?.departureTime)}
                                        </h3>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 p-3 rounded text-center">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Seat</p>
                                        <h3 className="text-2xl font-bold text-blue-800">{assignedSeat}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SECTION - TEAR-OFF STUB */}
                            <div className="md:w-1/4 bg-blue-600 text-white p-6 md:p-8 flex flex-col justify-start print:border-l-2 print:border-dashed print:border-gray-800 print:bg-white print:text-black">
                                <h3 className="text-xl font-bold tracking-wider mb-6 border-b border-blue-400 pb-2 print:border-gray-300">
                                    STUB
                                </h3>
                                
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase print:text-gray-500">Passenger</p>
                                        <p className="font-bold uppercase truncate">{passenger.firstName} {passenger.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase print:text-gray-500">Flight</p>
                                        <p className="font-bold">FL-{flight?.id || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase print:text-gray-500">Date & Time</p>
                                        <p className="font-bold text-sm">{flight?.departureDate || "N/A"}</p>
                                        <p className="font-bold">{flight?.departureTime || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 uppercase print:text-gray-500">Seat / Class</p>
                                        <p className="font-bold">{assignedSeat} / {booking?.seatClass || "Economy"}</p>
                                    </div>
                                </div>
                                {/* Barcode removed per your request! */}
                            </div>
                        </div>
                    );
                })}

                <div className="hidden print:block text-xs text-gray-500 mt-8 border-t pt-4">
                    <strong>Important Information:</strong> Please ensure you arrive at the airport at least 2 hours prior to departure. Gate closes 20 minutes before departure time. Baggage allowance is {isBusiness ? '40kg' : '15kg'} check-in and 7kg cabin baggage per passenger. Please carry valid government-issued photo ID.
                </div>

                <div className="flex justify-center gap-4 mt-8 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-800 hover:bg-black text-white font-bold px-8 py-3 rounded-lg shadow-md transition"
                    >
                        🖨️ Print Tickets
                    </button>

                    <Link
                        to="/index"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition"
                    >v
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}