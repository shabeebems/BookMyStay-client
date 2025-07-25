import React from 'react';
import { FcGoogle } from 'react-icons/fc';  // For Google Icon

const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URI}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full border border-gray-300 rounded-lg shadow-sm hover:shadow-md py-3 transition duration-150 ease-in-out bg-white hover:bg-gray-50 cursor-pointer"
    >
      <FcGoogle className="w-6 h-6 mr-3" />
      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
