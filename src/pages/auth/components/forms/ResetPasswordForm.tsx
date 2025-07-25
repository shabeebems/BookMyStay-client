import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { postRequest } from '../../../../hooks/api';

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get('token');
  const role = new URLSearchParams(search).get('role');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setSuccessMessage('');

    if (!token) {
      setFormErrorMessage('Reset token is missing.');
      setTimeout(() => setFormErrorMessage(''), 3000);
      return;
    }

    if (password.length < 6) {
      setFormErrorMessage('Passwords must be 6 characters.');
      setTimeout(() => setFormErrorMessage(''), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setFormErrorMessage("Passwords don't match.");
      setTimeout(() => setFormErrorMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postRequest('/auth/reset-password', { token, password });

      setSuccessMessage(response.data.message || 'Password reset successful.');
      setTimeout(() => {
        navigate(`/login/${role}`);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormErrorMessage(error.response?.data?.message || 'Reset failed.');
      } else {
        setFormErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Reset Password
      </h2>

      {formErrorMessage && (
        <div className="bg-red-100 text-red-800 text-sm p-2 rounded mb-4">
          {formErrorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-800 text-sm p-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md p-3 text-sm"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md p-3 text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
