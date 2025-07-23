import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {

  const navigate = useNavigate();
    
  const mostPickedHotels = [
    {
      name: "Maldives",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Bali",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Delhi",
      img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sri Lanka",
      img: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Goa",
      img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Thailand",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-3 shadow-sm sticky top-0 bg-white z-50">
    <div className="flex items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
        <span className="text-blue-800">Book</span>MyStay
      </h1>
    </div>
    
    <nav className="hidden md:flex space-x-8">
      <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Home</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Hotels</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">Profile</a>
    </nav>
    
    <div className="flex items-center space-x-4">
      <button
        onClick={() => navigate('/register/user')}
        className="hidden sm:block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer"
    >
        Sign Up
      </button>
      <button 
        onClick={() => navigate('/login/user')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
    >
        Login
      </button>
    </div>
  </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-gray-50 gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Forget Busy Work,
            <br /> Start Next Vacation
          </h2>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition">
            Show More
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
          alt="Hotel Room"
          className="w-full md:w-1/2 rounded-3xl shadow-lg"
        />
      </section>

      {/* Filters */}
      <section className="px-6 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white shadow-md p-4 rounded-2xl">
          <select className="border px-4 py-2 rounded-full w-full md:w-auto text-gray-700">
            <option>Check Available</option>
          </select>
          <select className="border px-4 py-2 rounded-full w-full md:w-auto text-gray-700">
            <option>Person: 1</option>
          </select>
          <select className="border px-4 py-2 rounded-full w-full md:w-auto text-gray-700">
            <option>Select Location</option>
          </select>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition w-full md:w-auto">
            Search
          </button>
        </div>
      </section>

      {/* Most Picked */}
      <section className="px-6 mt-12">
        <h3 className="text-2xl font-bold mb-6">Most Picked</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mostPickedHotels.map((hotel, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <img
                src={hotel.img}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center font-semibold text-gray-700">
                {hotel.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="px-6 py-12 mt-16 bg-blue-50 rounded-3xl mx-4 shadow-inner">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            alt="Pool View"
            className="w-full md:w-1/2 rounded-2xl shadow-lg"
          />
          <div className="flex-1 space-y-4">
            <h4 className="text-3xl font-bold text-gray-800">Free cancellation on most hotels</h4>
            <p className="text-gray-600 text-lg">
              Book your stay with peace of mind. Most of our hotels offer free cancellation
              up to 24 hours before check-in.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 px-6 py-6 bg-gray-100 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© 2025 LankaStay. All rights reserved.</p>
          <a
            href="/login/owner"
            className="mt-2 md:mt-0 text-sm text-blue-600 font-semibold hover:underline"
          >
            Sign in as Hotel Owner
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
