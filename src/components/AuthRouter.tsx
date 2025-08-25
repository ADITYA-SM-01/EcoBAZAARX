import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ProductCatalogue from '../pages/ProductCatalogue';

const AuthRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  console.log('AuthRouter render:', { isAuthenticated, isLoading, currentView });

  if (isLoading) {
    console.log('Showing loading screen...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading EcoBAZZARX...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log('User is authenticated, showing ProductCatalogue...');
    return <ProductCatalogue />;
  }

  console.log('User is not authenticated, showing login/signup...');
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100">
      {/* Navigation Tabs */}
      <div className="flex justify-center pt-8">
        <div className="bg-white rounded-xl p-1 shadow-lg border border-eco-200">
          <div className="flex">
            <button
              onClick={() => setCurrentView('login')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'login'
                  ? 'bg-eco-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-eco-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentView('signup')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === 'signup'
                  ? 'bg-eco-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-eco-600'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {currentView === 'login' ? (
          <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
        )}
      </div>
    </div>
  );
};

export default AuthRouter;
