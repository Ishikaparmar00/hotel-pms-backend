import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const AccountCreated: React.FC = () => {
  return (
    <div className="animate-fade-in text-center space-y-6">
      <div className="flex justify-center mb-6">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account Created Successfully!</h2>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Your EventHub360 account has been created. A verification link has been sent to your email address. Please check your inbox and verify your email to activate your account.
        </p>
      </div>

      <div className="pt-4">
        <Link 
          to="/auth/login" 
          className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
        >
          Proceed to Login
        </Link>
      </div>
    </div>
  );
};
