import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type OtpFormProps = {
  email: string;
  role: string;
};

const OtpForm: React.FC<OtpFormProps> = ({ email, role }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [count, setCount] = useState<number>(3);
  const [showResend, setShowResend] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
    }
  }, [count]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-input-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalOtp = otp.join('');

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/verify-otp`,
        { otp: finalOtp, email, role },
        { withCredentials: true }
      );

      const { success, message } = response.data;

      if (success) {
        setMessageType('success');
        setMessage(message);
        setTimeout(() => navigate(`/login/${role}`), 1500);
      } else {
        setMessageType('error');
        setMessage(message);
      }
    } catch (error: any) {
      setMessageType('error');
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } finally {
      setTimeout(() => setMessage(''), 3000);
      setIsSubmitting(false);
    }
  };

  const resend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setShowResend(false);
      setCount(3);
      await axios.post(
        `http://localhost:3000/api/auth/resend-otp`,
        { email },
        { withCredentials: true }
      );
      setMessageType('success');
      setMessage('OTP resent');
    } catch (error) {
      setMessageType('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-3xl shadow-xl space-y-8 animate-fadeIn">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 4-digit code sent to{' '}
            <span className="font-medium text-gray-800">{email}</span>
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-sm font-medium text-center ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-14 h-14 text-2xl text-center bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isOtpComplete || isSubmitting}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>

          {showResend ? (
            <div className="text-center text-sm text-gray-600">
              Didn’t receive the code?{' '}
              <button
                type="button"
                onClick={resend}
                className="text-gray-900 font-medium hover:underline transition cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <p className="mt-2 text-center text-sm text-gray-900">
              Resend button will show after {count}s
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
