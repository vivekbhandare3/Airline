import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSelection() {
    const location = useLocation();
    const navigate = useNavigate();

    const { bookingId, totalAmount } = location.state || {
        bookingId: "",
        totalAmount: 0,
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async (method) => {
        try {
            setLoading(true);
            setError("");

            await axios.post(
                "http://localhost:8080/processPayment",
                new URLSearchParams({
                    bookingId,
                    paymentMethod: method,
                }),
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                    withCredentials: true,
                }
            );

            navigate(`/ticket/${bookingId}`);
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
                        "Payment failed."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-gray-800 text-white py-4 text-center text-xl font-bold shadow">
                🛡️ Secure Payment Gateway
            </nav>

            <div className="flex-grow flex justify-center items-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

                    <div className="text-center mb-8">
                        <h4 className="text-gray-500 uppercase text-sm">
                            Total Payable Amount
                        </h4>

                        <h1 className="text-5xl font-bold text-green-600 mt-2">
                            ₹{Number(totalAmount).toFixed(2)}
                        </h1>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-5">
                            {error}
                        </div>
                    )}

                    <h3 className="text-xl font-bold mb-5">
                        Select Payment Method
                    </h3>

                    <div className="space-y-4">

                        <button
                            disabled={loading}
                            onClick={() => handlePayment("CARD")}
                            className="w-full p-5 border rounded-xl hover:border-blue-500 hover:bg-blue-50 text-left disabled:opacity-50"
                        >
                            <div className="text-lg font-bold">
                                💳 Debit / Credit Card
                            </div>

                            <div className="text-gray-500 text-sm">
                                Visa, Mastercard, Amex
                            </div>
                        </button>

                        <button
                            disabled={loading}
                            onClick={() => handlePayment("UPI")}
                            className="w-full p-5 border rounded-xl hover:border-green-500 hover:bg-green-50 text-left disabled:opacity-50"
                        >
                            <div className="text-lg font-bold">
                                📱 UPI Payment
                            </div>

                            <div className="text-gray-500 text-sm">
                                Google Pay, PhonePe, Paytm
                            </div>
                        </button>

                    </div>

                    {loading && (
                        <p className="text-center mt-6 text-blue-600">
                            Processing payment...
                        </p>
                    )}

                    <p className="text-center mt-8 text-sm text-gray-500">
                        🔒 Your transaction is encrypted and secure.
                    </p>

                </div>
            </div>
        </div>
    );
}