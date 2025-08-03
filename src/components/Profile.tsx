import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { protectedGetRequest, protectedPutRequest } from '../hooks/api';

interface Address {
  city?: string;
  state?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  mobile?: string | null;
  address?: Address | null;
  image?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    _id: '',
    name: '',
    email: '',
    mobile: '',
    address: null,
    image: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await protectedGetRequest("/profile");
      if (response && response.data && response.data.data) {
        setUser(response.data.data);
      }
    };
    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return
    if(file.size > 2 * 1024 * 1024) {
      e.target.value = ''
      alert('Image size must be less than 2 mb');
    } else {
      setFileToBase(file)
    }
  };

  const setFileToBase = async(file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async() => {
      const response = await protectedPutRequest("/profile", { userId: user._id, image: reader.result })
      if (response && response.data && response.data.data) {
        const updatedImage = response.data.data.image;
        setUser((prevUser) => ({
          ...prevUser,
          image: updatedImage,
        }));
      }
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/background.jpg')` }}>
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 sm:p-10 md:p-12 w-full max-w-3xl mx-4">
        {/* Profile Image */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-600">
            <div className="w-full h-full rounded-full overflow-hidden">
              {user.image ? (
                <img src={user.image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
              title="Edit Profile Picture"
            >
              <FaPlus size={12} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input
              type="text"
              value={user.name || ''}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Mobile</label>
            <input
              type="text"
              value={user.mobile || 'N/A'}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">City</label>
            <input
              type="text"
              value={user.address?.city || 'N/A'}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">State</label>
            <input
              type="text"
              value={user.address?.state || 'N/A'}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
