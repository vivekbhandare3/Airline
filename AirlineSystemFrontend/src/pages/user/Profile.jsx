import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8080/user/profile", {
                    withCredentials: true
                });

                // ADD THIS LINE:
                console.log("Profile Data from Java:", response.data);

                setUser(response.data.user);
                setBookings(response.data.bookings || []);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                }

                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/cancelBooking/${bookingId}`,
                {},
                { withCredentials: true }
            );

            setBookings(prev =>
                prev.map(b =>
                    b.id === bookingId
                        ? { ...b, status: "CANCELLED" }
                        : b
                )
            );

            alert("Booking cancelled successfully.");

        } catch (err) {
            // FIX: Intelligently extract the exact error message from Spring Boot!
            const backendError = err.response?.data?.error;
            
            if (backendError) {
                alert("Cancellation Failed: " + backendError);
            } else {
                alert("Something went wrong. Check the console.");
            }
            
            console.error("Full error details:", err);
        }
    };

    if (loading) {
        return (
            <p className="text-center py-20">
                Loading...
            </p>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                    Welcome, {user?.username}
                </h2>

                <span className="text-gray-500">
                    Booking History
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20">
                    <h4 className="text-xl">
                        You haven't booked any flights yet.
                    </h4>

                    <Link
                        to="/index"
                        className="bg-blue-600 text-white px-5 py-2 rounded mt-4 inline-block"
                    >
                        Search Flights
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">

                    {bookings.map((b) => (

                        <div
                            key={b.id}
                            className="bg-white rounded-xl shadow p-6"
                        >

                            <div className="flex justify-between">

                                <div>

                                    <h4 className="text-xl font-bold">
                                        {b.flight.airline.name}
                                    </h4>

                                    <p>
                                        {b.flight?.route?.origin || "N/A"}
                                        {" → "}
                                        {b.flight?.route?.destination || "N/A"}
                                    </p>

                                </div>

                                <span className="font-bold">
                                    {b.status}
                                </span>

                            </div>

                            <div className="mt-6 flex gap-3">

                                {b.status === "CONFIRMED" && (

                                    <Link
                                        to={`/ticket/${b.id}`}
                                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded"
                                    >
                                        Boarding Pass
                                    </Link>

                                )}

                                {b.status !== "CANCELLED" && (

                                    <button
                                        onClick={() =>
                                            handleCancelBooking(b.id)
                                        }
                                        className="border border-red-500 text-red-500 px-4 py-2 rounded"
                                    >
                                        Cancel Booking
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}