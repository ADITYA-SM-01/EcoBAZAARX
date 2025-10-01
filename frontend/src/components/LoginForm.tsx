import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Crown,
  Store,
  User,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

type UserRole = 'admin' | 'seller' | 'customer';

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { updateUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<UserRole, string>>({
    admin: '',
    seller: '',
    customer: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem('ecobazzarx_user');
      const response = await fetch('http://localhost:8090/req/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          [selectedRole]: 'Invalid email or password. Please try again.',
        }));
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      
      // Check if user has access to the selected role
      if (selectedRole === 'admin' && !userData.isAdmin) {
        setErrors((prev) => ({
          ...prev,
          admin: 'Only users with admin access can log in.',
        }));
        setIsLoading(false);
        return;
      }
      if (selectedRole === 'seller' && !userData.isSeller) {
        setErrors((prev) => ({
          ...prev,
          seller: 'Only users with seller access can log in.',
        }));
        setIsLoading(false);
        return;
      }

      // Use the selected role instead of default role hierarchy
      const role = selectedRole;

      updateUser({
        id: userData.id,
        email: userData.email,
        name: userData.username || userData.name || '',
        role, // This is now the selected role during login
        avatar: '',
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        ecoPoints: userData.ecoPoints || 0,
        totalCarbonSaved: userData.totalCarbonSaved || 0,
        productsPurchased: userData.productsPurchased || 0,
        joinDate: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        isVerified: !!userData.verified,
        // Store additional role permissions
        isAdmin: userData.isAdmin || false,
        isSeller: userData.isSeller || false
      });

      setIsLoading(true);
      setTimeout(() => {
        navigate('/');
        // Let the user choose where to go
      }, 900);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [selectedRole]: 'Login failed. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({ admin: '', seller: '', customer: '' });
    setEmail('');
    setPassword('');
  };

  const roleConfig = {
    admin: {
      icon: Crown,
      title: 'Admin Portal',
      description: 'Manage the platform',
      gradient: 'from-purple-500 to-indigo-600',
    },
    seller: {
      icon: Store,
      title: 'Seller Dashboard',
      description: 'Manage products & sales',
      gradient: 'from-blue-500 to-cyan-600',
    },
    customer: {
      icon: User,
      title: 'Customer Portal',
      description: 'Shop eco-friendly products',
      gradient: 'from-green-500 to-emerald-600',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-eco-400 to-green-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-blue-400 opacity-30 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="max-w-4xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-slow">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-eco-600 to-blue-600 bg-clip-text text-transparent">EcoBAZZARX</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Choose your role and sign in to start your sustainable journey.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {(['admin', 'seller', 'customer'] as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            const isSelected = selectedRole === role;

            return (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 shadow-xl border ${
                  isSelected
                    ? 'bg-gradient-to-r ' + config.gradient + ' text-white shadow-2xl scale-105'
                    : 'bg-white border-gray-200 hover:shadow-lg'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-eco-500 to-eco-700 rounded-full flex items-center justify-center animate-ping">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{config.title}</h3>
                  <p className="text-sm opacity-90">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fade-in">
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${roleConfig[selectedRole].gradient} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg`}>
                {React.createElement(roleConfig[selectedRole].icon, { className: 'w-8 h-8 text-white' })}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                Sign in to {roleConfig[selectedRole].title}
              </h2>
              <p className="text-gray-600 text-sm">{roleConfig[selectedRole].description}</p>
            </div>

            {/* Error */}
            {errors[selectedRole] && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-sm font-medium">{errors[selectedRole]}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-colors shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-colors shadow-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r ' + roleConfig[selectedRole].gradient + ' hover:scale-105 focus:ring-2 focus:ring-offset-2'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Switch */}
            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-eco-600 hover:text-eco-700 font-semibold">
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;