import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequest } from '../../../../hooks/api';

const ForgotPasswordForm: React.FC = () => {
  const { role } = useParams<string>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await postRequest('/auth/forgot-password', { email, role });

      setSuccessMessage(response.data.message || 'Password reset link sent to your email.');
      setTimeout(() => {
        navigate(`/login/${role}`);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        setFormErrorMessage(responseData?.message || 'Failed to send reset link.');
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
        Forgot Password
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
          type="email"
          name="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md p-3 text-sm"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Remember your password?{' '}
        <a href={`/login/${role}`} className="text-blue-600 hover:text-blue-500 font-medium">
          Login
        </a>
      </p>
    </>
  );
};

export default ForgotPasswordForm;
