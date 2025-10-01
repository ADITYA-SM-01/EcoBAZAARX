import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CustomerProfile from '../components/CustomerProfile';
import { useAuth } from '../context/AuthContext';
import { 
  User, Edit, Activity, TrendingUp,
  ShoppingBag, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileData {
  bio?: string;
  phone?: string;
  address?: string;
  purchases?: Array<{
    id: string;
    productName: string;
    date: string;
    price: number;
    carbonFootprint: number;
  }>;
  sales?: Array<{
    id: string;
    productName: string;
    date: string;
    amount: number;
    customerName: string;
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  recentActivity?: Array<{
    id: string;
    description: string;
    date: string;
  }>;
}

interface Props {}

const ProfilePage: React.FC<Props> = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'activity' | 'settings'>(urlTab === 'orders' ? 'overview' : 'overview');

  useEffect(() => {
    if (searchParams.get('tab') === 'orders') {
      setActiveTab('overview');
    }
  }, [searchParams]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.name) return;
      try {
        const response = await fetch(`http://localhost:8090/req/users/${user.name}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [user?.name]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 flex items-center justify-center">
        <div className="loading-shimmer rounded-full p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eco-600"></div>
          <p className="text-eco-600 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100">
      <Navigation onSearch={() => {}} />
      {/* Pass the tab parameter as initialTab to CustomerProfile */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-eco-600 hover:bg-eco-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {user.role === 'seller' ? 'Seller Profile' : user.role === 'admin' ? 'Admin Profile' : 'Customer Profile'}
          </h1>
        </div>

        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-10 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-eco-100 dark:bg-eco-900 flex items-center justify-center overflow-hidden shadow-md">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-eco-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="bg-eco-50 dark:bg-eco-900 px-5 py-2 rounded-full shadow-sm mt-3 md:mt-0">
                  <span className="text-eco-600 font-medium capitalize">{user.role}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
                {user.role === 'customer' && (
                  <>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Eco Points</p>
                      <p className="text-xl font-bold text-eco-600">{user.ecoPoints}</p>
                    </div>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Carbon Saved</p>
                      <p className="text-xl font-bold text-eco-600">{user.totalCarbonSaved.toFixed(2)}kg CO₂</p>
                    </div>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Products Purchased</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{user.productsPurchased}</p>
                    </div>
                  </>
                )}
                {user.role === 'seller' && (
                  <>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Products Listed</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{user.productsListed}</p>
                    </div>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                      <p className="text-xl font-bold text-eco-600">₹{user.totalSales}</p>
                    </div>
                    <div className="bg-eco-50 dark:bg-eco-900 p-5 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer Ratings</p>
                      <p className="text-xl font-bold text-eco-600">{user.rating} ★</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
          {['overview', 'stats', 'activity', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-eco-600 text-white'
                  : 'text-gray-600 hover:text-eco-600 hover:bg-eco-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Render CustomerProfile if user is customer */}
        {user.role === 'customer' && <CustomerProfile initialTab={urlTab as any || 'overview'} />}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {(profileData?.bio || editMode) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 mb-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5 text-eco-600" />
                    Bio
                  </span>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="text-sm bg-eco-50 hover:bg-eco-100 text-eco-600 px-3 py-1 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {editMode ? 'Save' : 'Edit'}
                  </button>
                </h3>
                {editMode ? (
                  <textarea
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-colors"
                    rows={4}
                    defaultValue={profileData?.bio || ''}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">{profileData?.bio || 'No bio added yet.'}</p>
                )}
              </motion.div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-eco-600" />
              Detailed Statistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.role === 'customer' && profileData?.purchases && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-eco-600" />
                    Purchase History
                  </h4>
                  <div className="space-y-2">
                    {profileData.purchases.map((purchase: any) => (
                      <div key={purchase.id} className="bg-eco-50 dark:bg-eco-900 p-3 rounded-lg">
                        <p className="font-medium">{purchase.productName}</p>
                        <p className="text-sm text-gray-500">{new Date(purchase.date).toLocaleDateString()}</p>
                        <div className="flex justify-between text-sm mt-1">
                          <span>₹{purchase.price}</span>
                          <span className="text-eco-600">{purchase.carbonFootprint}g CO₂</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user.role === 'seller' && profileData?.sales && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-eco-600" />
                    Recent Sales
                  </h4>
                  <div className="space-y-2">
                    {profileData.sales.map((sale: any) => (
                      <div key={sale.id} className="bg-eco-50 dark:bg-eco-900 p-3 rounded-lg">
                        <p className="font-medium">{sale.productName}</p>
                        <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-eco-600">₹{sale.amount}</span>
                          <span>{sale.customerName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileData?.reviews && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-eco-600" />
                    Recent Reviews
                  </h4>
                  <div className="space-y-2">
                    {profileData.reviews.map((review: any) => (
                      <div key={review.id} className="bg-eco-50 dark:bg-eco-900 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{review.author}</p>
                          <span className="text-eco-600">{review.rating} ★</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-eco-600" />
              Recent Activity
            </h3>

            {profileData?.recentActivity ? (
              <div className="space-y-4">
                {profileData.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="bg-eco-50 dark:bg-eco-900 p-2 rounded-lg">
                      <Activity className="w-5 h-5 text-eco-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity to show.</p>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={profileData?.phone || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  defaultValue={profileData?.address || ''}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="bg-eco-600 text-white px-6 py-2 rounded-lg hover:bg-eco-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;