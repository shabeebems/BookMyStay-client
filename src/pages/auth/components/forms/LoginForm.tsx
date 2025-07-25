import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../googleAuth/GoogleLoginButton';

type LoginFormProps = {
  role: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(
        'http://localhost:3000/api/auth/login',
        { ...formData, role },
        { withCredentials: true }
      );

      setSuccessMessage('✅ Login successful!');
      setTimeout(() => {
        navigate(`/home/${role}`);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (Array.isArray(responseData?.errors)) {
          const errorMap: { [key: string]: string } = {};
          responseData.errors.forEach((err: { field: string; message: string }) => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
        } else if (responseData?.message) {
          setFormErrorMessage(responseData.message);
        }
      } else {
        setFormErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {role.charAt(0).toUpperCase() + role.slice(1)} Login
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
      
      <div className="space-y-4">
        <GoogleLoginButton />
      </div>

      <div className="flex items-center justify-between">
        <div className="border-t w-1/5 border-gray-300"></div>
        <p className="text-sm text-gray-500">or continue with email</p>
        <div className="border-t w-1/5 border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 text-sm"
        />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 text-sm"
        />
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}

        <div className="text-right">
          <a href={`/forgot-password/${role}`} className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
        >
          {isSubmitting ? 'Login...' : 'Login'}
        </button>
      </form>

      {role !== 'admin' && (
        <p className="text-sm text-center mt-4 text-gray-600">
          Don&apos;t have an account?{' '}
          <a
            href={`/register/${role}`}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Register
          </a>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
