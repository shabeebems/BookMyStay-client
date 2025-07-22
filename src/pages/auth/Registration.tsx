import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

type RegisterFormProps = {
  role: string;
};

const Registration: React.FC<RegisterFormProps> = ({ role }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: {
      city: '',
      state: ''
    }
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/users`,
        { ...formData, role },
        { withCredentials: true }
      );
      console.log("Success:", response.data);
      setSuccessMessage("✅ Form validation completed, proceed to OTP.");
      setErrors({});
      setFormErrorMessage('');
      setTimeout(() => {
        navigate(`/otp/${role}/${formData.email}`);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.log(responseData);
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
    } finally {
      setIsLoading(false);
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
            {role.charAt(0).toUpperCase() + role.slice(1)} Register
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
            <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}

            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}

            <input name="mobile" type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
            {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input name="city" type="text" placeholder="City" value={formData.address.city} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <input name="state" type="text" placeholder="State" value={formData.address.state} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
                {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}

            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 text-sm" />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition flex justify-center items-center cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : 'Register'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
