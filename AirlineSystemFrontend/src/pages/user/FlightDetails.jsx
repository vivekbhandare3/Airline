import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function FlightDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();
  // FIX 2: Initialized location so React knows how to read the state
  const location = useLocation(); 
  
  // Now it can successfully catch the number!
  const passengersCount = location.state?.passengersCount || 1;  
  
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/flightDetails/${id}`, {
            withCredentials: true 
        });
        
        setFlight(response.data);

      } catch (err) {
        console.error("Error fetching flight details:", err);
        alert("Failed to load flight details. " + (err.response?.data?.message || ""));
      }
    };
    
    fetchFlightDetails();
  }, [id]);

  if (!flight) return <div className="text-center py-20">Loading...</div>;

  const isCancelled = flight.status === 'Cancelled';

  const handleBook = (seatClass) => {
    navigate(`/book/${flight.id}/passengers`, {
      state: { flightId: flight.id, seatClass: seatClass, passengersCount: passengersCount }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{flight.airline.name}</h1>
              <p className="text-gray-500 text-lg">Aircraft: {flight.flightBlueprint?.aircraftModel}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded shadow-sm text-sm font-bold text-white ${isCancelled ? 'bg-red-500' : 'bg-green-500'}`}>
                {flight.status || 'Scheduled'}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row text-center my-12 items-center justify-between relative">
            <div className="md:w-5/12">
              <h2 className="text-3xl font-bold text-gray-800">{flight.route.origin}</h2>
              <p className="text-gray-500 mb-1">{flight.departureDate}</p>
              <h3 className="text-blue-600 font-bold text-4xl">{flight.departureTime}</h3>
            </div>
            
            <div className="hidden md:block md:w-2/12 relative">
              <div className="border-t-2 border-dashed border-gray-300 w-full absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <span className="text-3xl text-blue-600 relative bg-white px-2">✈️</span>
            </div>

            <div className="md:w-5/12 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-800">{flight.route.destination}</h2>
              <p className="text-gray-500 mb-1">{flight.arrivalDate}</p>
              <h3 className="text-blue-600 font-bold text-4xl">{flight.arrivalTime}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Economy Card */}
            <div className="border-2 border-blue-500 rounded-xl p-6 text-center shadow-sm">
              <h4 className="text-xl font-bold text-gray-800">Economy Class</h4>
              <p className="text-4xl font-bold text-blue-600 my-4">₹{flight.economyPrice}</p>
              <p className="text-gray-500 mb-6">💺 {flight.availableEconomySeats} seats available</p>
              
              {!isCancelled && flight.availableEconomySeats >= passengersCount ? (
                <button 
                  onClick={() => handleBook('Economy')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition text-lg"
                >
                  Book Economy
                </button>
              ) : (
                <button disabled className="w-full bg-gray-400 text-white font-bold py-3 rounded-full text-lg cursor-not-allowed">
                  {isCancelled ? 'Cancelled' : 'Sold Out'}
                </button>
              )}
            </div>

            {/* Business Card */}
            <div className="border-2 border-gray-800 rounded-xl p-6 text-center shadow-sm">
              <h4 className="text-xl font-bold text-gray-800">Business Class</h4>
              <p className="text-4xl font-bold text-gray-900 my-4">₹{flight.businessPrice}</p>
              <p className="text-gray-500 mb-6">💺 {flight.availableBusinessSeats} seats available</p>
              
              {!isCancelled && flight.availableBusinessSeats >= passengersCount ? (
                <button 
                  onClick={() => handleBook('Business')}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-full transition text-lg"
                >
                  Book Business
                </button>
              ) : (
                <button disabled className="w-full bg-gray-400 text-white font-bold py-3 rounded-full text-lg cursor-not-allowed">
                  {isCancelled ? 'Cancelled' : 'Sold Out'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/index" className="text-gray-500 hover:text-gray-800 font-medium transition">
              ← Back to Flight Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}