import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, Crown, Store, Sparkles, Shield, TrendingUp, Heart } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

type UserRole = 'admin' | 'seller' | 'customer';

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Build payload based on role
      const payload: any = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location
      };
      if (formData.role === 'seller') {
        payload.isSeller = true;
      } else if (formData.role === 'admin') {
        payload.isAdmin = true;
      }

      const response = await fetch('http://localhost:8090/req/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setError('Failed to create account. Please try again.');
      } else {
        // Fetch user details and redirect
        const username = formData.name;
        try {
          const userRes = await fetch(`http://localhost:8090/req/users/${encodeURIComponent(username)}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            // Redirect based on role
            if (userData.isAdmin) {
              navigate('/admin/dashboard');
            } else if (userData.isSeller) {
              navigate('/seller/dashboard');
            } else {
              navigate('/customer/dashboard');
            }
          } else {
            setError('Signup succeeded, but failed to fetch user details.');
          }
        } catch (err) {
          setError('Signup succeeded, but failed to fetch user details.');
        }
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword;
  const isLocationValid = formData.location && formData.location.length > 0;

  const roleConfig = {
    admin: {
      icon: Crown,
      title: 'Admin Account',
      description: 'Full platform management access',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      features: [
        { icon: Shield, text: 'Full system access' },
        { icon: TrendingUp, text: 'Analytics & reports' },
        { icon: Sparkles, text: 'User management' }
      ]
    },
    seller: {
      icon: Store,
      title: 'Seller Account',
      description: 'Sell your eco-friendly products',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      features: [
        { icon: Store, text: 'Product management' },
        { icon: TrendingUp, text: 'Sales analytics' },
        { icon: Heart, text: 'Customer insights' }
      ]
    },
    customer: {
      icon: User,
      title: 'Customer Account',
      description: 'Shop sustainable products',
      color: 'from-eco-500 to-eco-600',
      bgColor: 'bg-eco-50',
      borderColor: 'border-eco-200',
      textColor: 'text-eco-700',
      features: [
        { icon: Heart, text: 'Wishlist & favorites' },
        { icon: Sparkles, text: 'Eco points rewards' },
        { icon: Shield, text: 'Secure shopping' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join EcoBAZZARX</h1>
          <p className="text-xl text-gray-600">Choose your role and create your account</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(['admin', 'seller', 'customer'] as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const IconComponent = config.icon;
            const isSelected = formData.role === role;
            
            return (
              <button
                key={role}
                onClick={() => setFormData({ ...formData, role })}
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
                
                <p className={`text-sm mb-4 ${isSelected ? config.textColor : 'text-gray-600'}`}>
                  {config.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  {config.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <feature.icon className={`w-3 h-3 ${isSelected ? config.textColor : 'text-gray-500'}`} />
                      <span className={isSelected ? config.textColor : 'text-gray-600'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Signup Form */}
        <div className="max-w-md mx-auto">
          <div className="gradient-modal rounded-2xl shadow-xl border border-eco-200 p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${roleConfig[formData.role].color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
                {React.createElement(roleConfig[formData.role].icon, { className: "w-8 h-8 text-white" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create {roleConfig[formData.role].title}
              </h2>
              <p className="text-gray-600">{roleConfig[formData.role].description}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Location Field */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                    placeholder="Enter your city, country, or address"
                  />
                </div>
              </div>

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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
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
                {formData.password && (
                  <div className="mt-2 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors ${
                      formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 bg-green-50'
                        : formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full bg-gradient-to-r ${roleConfig[formData.role].color} text-white py-3 px-4 rounded-lg font-medium hover:scale-105 focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create {roleConfig[formData.role].title}
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

            {/* Switch to Login */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-eco-600 hover:text-eco-700 font-medium transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-eco-600 hover:text-eco-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-eco-600 hover:text-eco-700">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
