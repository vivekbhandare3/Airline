import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const passengers = searchParams.get('passengers') || 1;

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // Spring Boot endpoint must be updated to return List<Flight> as JSON
            const { data } = await axios.get(
              `http://localhost:8080/flightDetails/${id}`
          );

          setFlight(data);
      } catch (err) {
        console.error("Error fetching flights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [origin, destination, date, passengers]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Available Flights</h3>
        <Link to="/index" className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition">
          Back to Search
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Searching for flights...</div>
      ) : flights.length === 0 ? (
        <div className="bg-blue-50 text-center p-8 rounded-lg shadow-sm border border-blue-100">
          <h4 className="text-xl font-bold text-gray-800 mb-2">No flights found for this route.</h4>
          <p className="text-gray-600 mb-4">Please try a different date or route.</p>
          <Link to="/index" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
            Search Again
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {flights.map((f) => (
            <div key={f.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center">
              
              <div className="md:w-1/4 text-center md:border-r border-gray-200 pb-4 md:pb-0">
                <h5 className="font-bold text-lg text-gray-900">{f.airline.name}</h5>
                <small className="text-gray-500">{f.flightBlueprint?.aircraftModel}</small>
              </div>
              
              <div className="md:w-1/2 flex justify-center items-center gap-6 py-4 md:py-0">
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{f.departureTime}</div>
                  <div className="font-medium text-gray-900">{f.departureDate}</div>
                  <small className="text-gray-500">{f.route.origin}</small>
                </div>
                <div className="text-gray-300 flex flex-col items-center px-4">
                  <span className="text-2xl mb-1">✈️</span>
                  <div className="h-px w-16 bg-gray-300"></div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-800">{f.arrivalTime}</div>
                  <div className="font-medium text-gray-900">{f.arrivalDate}</div>
                  <small className="text-gray-500">{f.route.destination}</small>
                </div>
              </div>
              
              <div className="md:w-1/4 text-center md:border-l border-gray-200 pt-4 md:pt-0 pl-0 md:pl-6">
                <p className="text-sm text-gray-500 mb-3">Select to see prices</p>
                <Link 
                  to={`/flightDetails/${f.id}?passengers=${passengers}`}
                  className="block w-full bg-blue-600 text-white font-bold py-2 rounded-full hover:bg-blue-700 transition"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}