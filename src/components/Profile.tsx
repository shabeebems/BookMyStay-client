import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { logoutRequest, protectedGetRequest, protectedPostRequest, protectedPutRequest } from '../hooks/api';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile>({
    _id: '',
    name: '',
    email: '',
    mobile: '',
    address: { city: '', state: '' },
    image: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await protectedGetRequest("/profile");
      if (response && response.data && response.data.data) {
        const data = response.data.data;
        setUser({
          ...data,
          address: data.address || { city: '', state: '' }
        });
      }
    };
    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      e.target.value = '';
      alert('Image size must be less than 2 MB');
    } else {
      setFileToBase(file);
    }
  };

  const setFileToBase = async (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const response = await protectedPutRequest("/profile", { userId: user._id, image: reader.result });
      if (response && response.data && response.data.data) {
        const updatedImage = response.data.data.image;
        setUser((prevUser) => ({
          ...prevUser,
          image: updatedImage,
        }));
      }
    };
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "city" || name === "state") {
      setUser((prevUser) => ({
        ...prevUser,
        address: {
          ...prevUser.address,
          [name]: value
        }
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = () => {
    // Call your API to save profile changes here.
    console.log("Updated Profile Data:", user);
    setIsEditing(false);
    alert("Profile updated successfully (mock)");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async() => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (oldPassword.length > 0 && oldPassword.length < 6) {
      alert("Leave empty if no password, else enter at least 6 characters.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    await protectedPostRequest("/change-password", { oldPassword, newPassword })
    console.log('Password Change Payload:', passwordForm);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
    alert("Password changed successfully (mock)");
    setTimeout(async () => {
      await logoutRequest("/auth/logout")
      localStorage.removeItem('token');
      navigate(`/login/user`);
    }, 2000);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={user.name || ''}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={user.mobile || ''}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">City</label>
            <input
              type="text"
              name="city"
              value={user.address?.city || ''}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">State</label>
            <input
              type="text"
              name="state"
              value={user.address?.state || ''}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition"
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {/* Change Password Form */}
        {showChangePassword && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm mb-1">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                onClick={handleSubmitPassword}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
              >
                Submit Password Change
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
