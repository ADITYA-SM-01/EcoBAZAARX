import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";

type UserRole = "admin" | "seller" | "customer";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as UserRole,
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const payload: any = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        // Set role flags based on selection
        isSeller: formData.role === "seller",
        isAdmin: formData.role === "admin",
        // Include the role directly
        role: formData.role
      };

      const response = await fetch("http://localhost:8090/req/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed. Please try again.");
      }

      const userData = await response.json();
      
      // Create user object with the selected role and permissions
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.username || formData.name,
        role: formData.role,
        isAdmin: formData.role === 'admin',
        isSeller: formData.role === 'seller',
        avatar: '',
        createdAt: new Date(),
        ecoPoints: 0,
        totalCarbonSaved: 0,
        productsPurchased: 0,
        joinDate: new Date(),
        isVerified: false
      };

      // Update the user in auth context
      await updateUser(user);

      // Wait a short moment for the user context to be updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to the appropriate dashboard based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin/analytics');
          break;
        case 'seller':
          navigate('/seller/dashboard');
          break;
        case 'customer':
        default:
          navigate('/');
          break;
      };
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-eco-500 to-eco-700 text-white p-10">
          <h2 className="text-4xl font-bold mb-6">Join EcoBAZZARX</h2>
          <p className="text-lg mb-8 text-eco-50/90">
            Empowering eco-conscious shopping with a role tailored just for you.
          </p>
          <ul className="space-y-4 text-left">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Sustainable Shopping & Selling
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Role-based Dashboards
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Secure & Modern Authentication
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h3>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City / Country"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Role Selection */}
            <div className="flex gap-3">
              {["customer", "seller", "admin"].map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setFormData({ ...formData, role: role as UserRole })}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.role === role
                      ? "bg-eco-500 text-white border-eco-500"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-eco-500 to-eco-700 text-white py-3 rounded-lg font-medium hover:scale-[1.02] transition disabled:opacity-50 relative"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-eco-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
