import React from 'react';

// AuthContainer component for shared styling
export const AuthContainer = ({ children, title, subtitle }) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
  
  // Input component for consistent styling
export const Input = ({ icon: Icon, error, ...props }) => (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          {...props}
          className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 
          border ${error ? 'border-red-500' : 'border-gray-300'}
          placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 
          focus:border-purple-500 focus:z-10 sm:text-sm`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );