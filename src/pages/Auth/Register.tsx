import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    hotelName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Hotel Owner',
    country: '',
    city: '',
    agreed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength; // 0 to 5
  };

  const strength = calculateStrength(formData.password);
  const strengthLabels = ['Weak', 'Weak', 'Medium', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-200', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.agreed) {
      setError("Please agree to the Terms & Conditions");
      return;
    }
    if (strength < 4) {
      setError("Password is too weak. Must contain uppercase, lowercase, number, and special character.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/auth/account-created');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-h-[80vh] overflow-y-auto px-1 py-2 custom-scrollbar">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join EventHub360 to manage your properties.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-semibold mb-6">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
            <input name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Hotel Name</label>
            <input required name="hotelName" value={formData.hotelName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
          <select required name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
            <option>Hotel Owner</option>
            <option>General Manager</option>
            <option>Front Desk</option>
            <option>Reservation Manager</option>
            <option>Housekeeping</option>
            <option>Maintenance</option>
            <option>Finance</option>
            <option>HR</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
            <input required name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
            <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>
        
        {formData.password && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`flex-1 ${i <= strength ? strengthColors[strength] : 'bg-transparent'}`}></div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-500 w-16 text-right">{strengthLabels[strength]}</span>
          </div>
        )}

        <div className="flex items-start mt-4">
          <input
            id="agreed"
            name="agreed"
            type="checkbox"
            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            checked={formData.agreed}
            onChange={handleChange}
          />
          <label htmlFor="agreed" className="ml-2 block text-xs text-gray-600 font-medium leading-relaxed">
            I agree to the <a href="#" className="text-orange-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
              loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 font-medium">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-bold text-orange-600 hover:text-red-600">
          Login
        </Link>
      </div>
    </div>
  );
};
