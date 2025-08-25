import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeaderboard } from '../context/LeaderboardContext';

import { 
  User, 
  Trophy, 
  Leaf, 
  ShoppingBag, 
  Award, 
  Calendar,
  Package,
  Edit,
  Camera
} from 'lucide-react';

const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const { getUserRank } = useLeaderboard();

  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'achievements'>('overview');

  // Mock data - in real app this would come from API
  const mockPurchaseHistory = [
    {
      id: '1',
      productName: 'Bamboo Water Bottle',
      date: new Date('2024-01-15'),
      price: 24.99,
      carbonFootprint: 0.8,
      ecoPoints: 25
    },
    {
      id: '2',
      productName: 'Organic Cotton Tote',
      date: new Date('2024-01-10'),
      price: 18.50,
      carbonFootprint: 1.2,
      ecoPoints: 20
    },
    {
      id: '3',
      productName: 'Beeswax Food Wraps',
      date: new Date('2024-01-05'),
      price: 15.99,
      carbonFootprint: 0.4,
      ecoPoints: 30
    }
  ];

  const mockAchievements = [
    {
      id: '1',
      title: 'Eco Pioneer',
      description: 'First purchase of a very low impact product',
      icon: '🌱',
      earned: true,
      date: new Date('2024-01-05')
    },
    {
      id: '2',
      title: 'Carbon Crusher',
      description: 'Saved 10kg of CO₂ through purchases',
      icon: '🌍',
      earned: true,
      date: new Date('2024-01-15')
    },
    {
      id: '3',
      title: 'Sustainable Shopper',
      description: 'Made 5 eco-friendly purchases',
      icon: '🛍️',
      earned: false
    },
    {
      id: '4',
      title: 'Eco Warrior',
      description: 'Reach 1000 eco points',
      icon: '🏆',
      earned: false
    }
  ];

  const totalEcoPoints = mockPurchaseHistory.reduce((sum, purchase) => sum + purchase.ecoPoints, 0);
  const totalCarbonSaved = mockPurchaseHistory.reduce((sum, purchase) => sum + purchase.carbonFootprint, 0);

  const userRank = getUserRank(user?.id || '');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-eco-200 p-8 mb-8">
          <div className="flex items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-eco-500 rounded-full flex items-center justify-center hover:bg-eco-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-eco-600">Member since {user?.createdAt?.toLocaleDateString()}</p>
                </div>
                <button className="eco-button-secondary flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-eco-50 rounded-xl border border-eco-200">
                  <div className="text-2xl font-bold text-eco-600">{totalEcoPoints}</div>
                  <div className="text-sm text-eco-700">Eco Points</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{totalCarbonSaved.toFixed(1)}</div>
                  <div className="text-sm text-blue-700">kg CO₂ Saved</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{mockPurchaseHistory.length}</div>
                  <div className="text-sm text-purple-700">Products</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">#{userRank || 'N/A'}</div>
                  <div className="text-sm text-orange-700">Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-eco-200 p-2 mb-8">
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-eco-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-eco-600 hover:bg-eco-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-eco-200 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Progress Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-eco-500 to-eco-600 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Eco Points Progress</h4>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{totalEcoPoints}</div>
                    <div className="text-eco-100">Next milestone: 1000 points</div>
                    <div className="mt-4">
                      <div className="w-full bg-eco-400 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalEcoPoints / 1000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Carbon Footprint</h4>
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{totalCarbonSaved.toFixed(1)} kg</div>
                    <div className="text-blue-100">CO₂ saved through purchases</div>
                    <div className="mt-4">
                      <div className="w-full bg-blue-400 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalCarbonSaved / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {mockPurchaseHistory.slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-eco-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-eco-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{purchase.productName}</div>
                        <div className="text-sm text-gray-500">
                          {purchase.date.toLocaleDateString()} • +{purchase.ecoPoints} eco points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${purchase.price}</div>
                        <div className="text-sm text-eco-600">{purchase.carbonFootprint} kg CO₂</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Purchase History</h3>
              <div className="space-y-4">
                {mockPurchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-gray-900">{purchase.productName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-eco-600">+{purchase.ecoPoints}</span>
                        <span className="text-sm text-gray-500">eco points</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{purchase.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">${purchase.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{purchase.carbonFootprint} kg CO₂ saved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements & Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockAchievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${achievement.earned ? 'animate-bounce' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg mb-1 ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-yellow-600 mt-2">
                            Earned on {achievement.date.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {achievement.earned && (
                        <Award className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
