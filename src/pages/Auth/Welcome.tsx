import React from 'react';
import { Link } from 'react-router-dom';

export const Welcome: React.FC = () => {
  return (
    <div className="animate-fade-in text-center space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to EventHub360</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          The all-in-one property management system designed to streamline your hotel operations and elevate guest experiences.
        </p>
      </div>

      <img 
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="Hotel Management" 
        className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-100"
      />

      <div className="pt-6 space-y-3">
        <Link 
          to="/auth/login" 
          className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
        >
          Sign In to Your Account
        </Link>
        <Link 
          to="/auth/register" 
          className="w-full flex justify-center py-3.5 px-4 border border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
};
