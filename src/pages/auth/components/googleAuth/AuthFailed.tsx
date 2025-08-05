import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthFailed: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [location.search]);

  const handleBackToLogin = () => {
    navigate('/login/user');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Login Failed</h2>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <button
          onClick={handleBackToLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AuthFailed;
