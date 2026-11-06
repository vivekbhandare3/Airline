import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function ViewPassengers() {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8080/admin/manage/flights/view/${id}`,
                    {
                        withCredentials: true,
                    }
                );

                setData(data);
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load passenger manifest."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchManifest();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading manifest...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600 font-bold">
                {error}
            </div>
        );
    }

    if (!data?.flight) {
        return (
            <div className="text-center py-20">
                Flight not found.
            </div>
        );
    }

    const { flight, bookings } = data;

    return (
        <div className="container mx-auto px-4 py-10 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">
                        Flight Manifest
                    </h2>

                    <p className="text-gray-500">
                        {flight.airline?.name} |{" "}
                        {flight.flightBlueprint?.aircraftModel}
                    </p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold">
                        Economy Left: {flight.availableEconomySeats}
                    </span>

                    <span className="bg-gray-800 text-white px-3 py-1 rounded font-bold">
                        Business Left: {flight.availableBusinessSeats}
                    </span>

                    <Link
                        to="/admin/manage/flights"
                        className="border px-4 py-1 rounded hover:bg-gray-100"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">PNR</th>
                            <th className="p-4 text-left">Passenger</th>
                            <th className="p-4 text-left">Gender</th>
                            <th className="p-4 text-left">Contact</th>
                            <th className="p-4 text-left">Seat Class</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Booking Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center p-8 text-gray-500"
                                >
                                    No passengers found.
                                </td>
                            </tr>
                        ) : (
                            bookings?.map((booking) => (
                                <React.Fragment key={booking.id}>
                                    {booking.passengers?.map(
                                        (passenger, index) => (
                                            <tr
                                                key={passenger.id || index}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="p-4 font-mono">
                                                    {booking.bookingGroupId}
                                                </td>

                                                <td className="p-4">
                                                    {passenger.title}{" "}
                                                    {passenger.firstName}{" "}
                                                    {passenger.lastName}
                                                </td>

                                                <td className="p-4">
                                                    {passenger.gender}
                                                </td>

                                                <td className="p-4">
                                                    {passenger.mobileNumber}
                                                </td>

                                                <td className="p-4">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-bold ${
                                                            booking.seatClass ===
                                                            "Business"
                                                                ? "bg-gray-800 text-white"
                                                                : "bg-blue-100 text-blue-700"
                                                        }`}
                                                    >
                                                        {booking.seatClass}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    <span
                                                        className={`font-bold ${
                                                            booking.status ===
                                                            "CANCELLED"
                                                                ? "text-red-600"
                                                                : "text-green-600"
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    {booking.bookingDateTime
                                                        ? new Date(
                                                              booking.bookingDateTime
                                                          ).toLocaleString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}