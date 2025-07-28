import React from 'react';
import { FaPlus } from 'react-icons/fa6';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/background.jpg')` }}>
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 sm:p-10 md:p-12 w-full max-w-3xl mx-4">
        {/* Profile Image */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src="data:image/jpeg;base64,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" alt="Profile" className="object-cover w-full h-full" />
            {/* + Button */}
            <button
              className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
              title="Edit Profile Picture"
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input type="text" value="Muhammed Shabeeb" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" readOnly />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input type="email" value="shabeeb.muhammed@example.com" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" readOnly />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Mobile</label>
            <input type="text" value="+91 9876543210" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" readOnly />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">City</label>
            <input type="text" value="Kochi" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" readOnly />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">State</label>
            <input type="text" value="Kerala" className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" readOnly />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Change Details</button>
          <button className="px-6 py-2 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
