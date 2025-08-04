import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { logoutRequest, protectedGetRequest, protectedPostRequest, protectedPutRequest } from '../hooks/api';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../components/ToastMessage';

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
  const [isUploading, setIsUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

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
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      e.target.value = '';
      showToast('Image size must be less than 2 MB', 'error');
    } else {
      setFileToBase(file);
    }
  };

  const setFileToBase = async (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const response = await protectedPutRequest("/profile", { userId: user._id, image: reader.result });
      if (response && response.data && response.data.data) {
        setUser((prevUser) => ({
          ...prevUser,
          image: response.data.data.image,
        }));
        showToast('Profile picture updated successfully', 'success');
      }
      setIsUploading(false);
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
    console.log("Updated Profile Data:", user);
    setIsEditing(false);
    showToast("Profile updated successfully (mock)", 'success');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match.", 'error');
      return;
    }
    if (oldPassword.length > 0 && oldPassword.length < 6) {
      showToast("Leave empty if no password, else enter at least 6 characters.", 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", 'error');
      return;
    }

    const response = await protectedPostRequest("/change-password", { oldPassword, newPassword });
    if (response && response.data && response.data.success) {
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      showToast("Password changed successfully", 'success');

      setTimeout(async () => {
        await logoutRequest("/auth/logout");
        localStorage.removeItem('token');
        navigate(`/login/user`);
      }, 1000);
    } else {
      showToast("Failed to change password", 'error');
    }
  };

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  return (
    <>
      <ToastMessage
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />

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

              {/* Loading Spinner Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <button
                onClick={handleImageClick}
                disabled={isUploading}
                className={`absolute -top-2 -left-2 w-8 h-8 rounded-full ${
                  isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white flex items-center justify-center shadow-md transition`}
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
            {[
              { label: 'Name', name: 'name', value: user.name, editable: true },
              { label: 'Email', name: 'email', value: user.email, editable: false },
              { label: 'Mobile', name: 'mobile', value: user.mobile, editable: true },
              { label: 'City', name: 'city', value: user.address?.city, editable: true },
              { label: 'State', name: 'state', value: user.address?.state, editable: true },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-gray-700 text-sm mb-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value || ''}
                  onChange={handleProfileChange}
                  className={`w-full px-4 py-2 rounded-xl ${field.editable ? 'bg-white' : 'bg-gray-100'} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  readOnly={!field.editable || !isEditing}
                />
              </div>
            ))}
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
              <div className="md:col-span-2 text-center text-sm text-red-600">
                After changing your password, you will need to log in again.
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
    </>
  );
};

export default ProfilePage;
