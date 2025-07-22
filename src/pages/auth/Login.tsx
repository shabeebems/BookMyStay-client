import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  role: string;
};

const Login: React.FC<LoginFormProps> = ({ role }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/login`,
        { ...formData, role },
        { withCredentials: true }
      );
      console.log("Login Success:", response.data);

      setSuccessMessage("✅ Login successful!");
      setErrors({});
      setFormErrorMessage('');

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
        console.error("Unknown Error:", error);
        setFormErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Image Section */}
      <div className="hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="House"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
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

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
