import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PassengerDetails() {
    const location = useLocation();
    const navigate = useNavigate();

   const {
        flightId,
        seatClass,
        passengersCount,
    } = location.state || {
        flightId: "",
        seatClass: "Economy",
        passengersCount: 1,
    };

    // SAFETY CATCH: Force it to be a real number so Array.from doesn't fail!
    const validCount = parseInt(passengersCount, 10) || 1;

    const [passengers, setPassengers] = useState(
        Array.from({ length: validCount }, () => ({
            title: "Mr",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "Male",
            mobileNumber: "",
        }))
    );

    const [error, setError] = useState("");

    const handleInputChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                `http://localhost:8080/confirmBooking?flightId=${flightId}&flightClass=${seatClass}`,
                { passengers },
                {
                    withCredentials: true,
                }
            );

            navigate("/payment", {
                state: {
                    bookingId: data.bookingId,
                    totalAmount: data.totalAmount,
                },
            });
        } catch (err) {
            console.error(err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                navigate("/login");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Booking failed."
                );
            }
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Enter Passenger Information
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {passengers.map((passenger, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow border overflow-hidden"
                    >
                        <div className="bg-blue-600 text-white px-6 py-3 font-bold">
                            Passenger #{index + 1}
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Title
                                </label>

                                <select
                                    value={passenger.title}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={passenger.firstName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block mb-1 font-medium">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={passenger.lastName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    required
                                    value={passenger.dateOfBirth}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "dateOfBirth",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">
                                    Gender
                                </label>

                                <select
                                    value={passenger.gender}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "gender",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={passenger.mobileNumber}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "mobileNumber",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg"
                >
                    Proceed to Payment
                </button>
            </form>
        </div>
    );
}