import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, KeyRound } from 'lucide-react';
import { api } from '../../services/api';

export const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Missing email address. Please go back and try again.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      navigate('/auth/reset-password', { state: { token: res.resetToken } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verify OTP</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Enter the 6-digit verification code sent to <br/><span className="font-bold text-gray-800">{email || 'your email'}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 mb-6">
          <AlertCircle size={16}/> {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">6-Digit OTP</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <KeyRound size={18} />
            </div>
            <input
              type="text"
              maxLength={6}
              required
              className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition text-center tracking-widest font-bold"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
              isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600 font-medium">
        Didn't receive a code?{' '}
        <Link to="/auth/forgot-password" className="font-bold text-orange-600 hover:text-red-600">
          Resend
        </Link>
      </div>
    </div>
  );
};
