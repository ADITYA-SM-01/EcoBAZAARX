import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Crown, Store, User, Sparkles, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

type UserRole = 'admin' | 'seller' | 'customer';

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, updateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clear previous user context to isolate sessions
      localStorage.removeItem('ecobazzarx_user');

      // Send login request to backend
      const response = await fetch('http://localhost:8090/req/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Use login response for user details and routing
      const userData = await response.json();

      // Determine backend role
      let role: 'admin' | 'seller' | 'customer' = 'customer';
  if (userData.isAdmin) role = 'admin';
  else if (userData.isSeller) role = 'seller';

        // Enforce section access rules:
        // 1. Customer section: all registered users can log in
        // 2. Seller section: only users with isSeller true
        // 3. Admin section: only users with isAdmin true
        if (selectedRole === 'seller' && !userData.isSeller) {
          setError('Only users with seller access can log in to the Seller Dashboard.');
          setIsLoading(false);
          return;
        }
        if (selectedRole === 'admin' && !userData.isAdmin) {
          setError('Only users with admin access can log in to the Admin Portal.');
          setIsLoading(false);
          return;
        }
        // Customer section: allow all

      updateUser({
        id: userData.id,
        email: userData.email,
        name: userData.username || userData.name || '',
        role,
        avatar: '',
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        ecoPoints: 0,
        totalCarbonSaved: 0,
        productsPurchased: 0,
        joinDate: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        isVerified: !!userData.verified
      });

      // Show loading spinner and smooth transition before navigation
      setIsLoading(true);
      setTimeout(() => {
        if (role === 'admin') navigate('/admin');
        else if (role === 'seller') navigate('/seller');
        else navigate('/customer');
      }, 900); // 900ms for smooth transition
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const getRoleCredentials = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { email: 'admin@ecobazzarx.com', password: 'admin123' };
      case 'seller':
        return { email: 'seller@ecobazzarx.com', password: 'seller123' };
      case 'customer':
        return { email: 'customer@ecobazzarx.com', password: 'customer123' };
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const credentials = getRoleCredentials(role);
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  const roleConfig = {
    admin: {
      icon: Crown,
      title: 'Admin Portal',
      description: 'Manage the entire platform',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    seller: {
      icon: Store,
      title: 'Seller Dashboard',
      description: 'Manage your products & sales',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    customer: {
      icon: User,
      title: 'Customer Portal',
      description: 'Shop eco-friendly products',
      color: 'from-eco-500 to-eco-600',
      bgColor: 'bg-eco-50',
      borderColor: 'border-eco-200',
      textColor: 'text-eco-700'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to EcoBAZZARX</h1>
          <p className="text-xl text-gray-600">Choose your role and sign in to continue</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(['admin', 'seller', 'customer'] as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const IconComponent = config.icon;
            const isSelected = selectedRole === role;
            
            return (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 ${
                  isSelected 
                    ? `${config.bgColor} ${config.borderColor} border-2 shadow-xl` 
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-eco-600 to-eco-700 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                  isSelected ? 'scale-110' : 'scale-100'
                }`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? config.textColor : 'text-gray-900'}`}>
                  {config.title}
                </h3>
                
                <p className={`text-sm ${isSelected ? config.textColor : 'text-gray-600'}`}>
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <div className="gradient-modal rounded-2xl shadow-xl border border-eco-200 p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${roleConfig[selectedRole].color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
                {React.createElement(roleConfig[selectedRole].icon, { className: "w-8 h-8 text-white" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to {roleConfig[selectedRole].title}
              </h2>
              <p className="text-gray-600">{roleConfig[selectedRole].description}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${roleConfig[selectedRole].color} text-white py-3 px-4 rounded-lg font-medium hover:scale-105 focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="ml-2">Signing In...</span>
                  </>
                ) : (
                  <>
                    Sign In to {roleConfig[selectedRole].title}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Switch to Signup */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-eco-600 hover:text-eco-700 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-eco-600" />
                Demo Credentials (Auto-filled)
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Email:</strong> {getRoleCredentials(selectedRole).email}</p>
                <p><strong>Password:</strong> {getRoleCredentials(selectedRole).password}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
