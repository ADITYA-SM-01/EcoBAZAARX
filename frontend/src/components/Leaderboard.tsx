import React, { useState } from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, TrendingUp, Leaf, Users, BarChart3, ShoppingBag, ArrowLeft } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { leaderboard, getTopUsers } = useLeaderboard();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ecoPoints' | 'carbonSaved' | 'products'>('all');

  const topUsers = getTopUsers(10);
  const currentUserRank = leaderboard.find(entry => entry.userId === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const timeFilters = [
    { id: 'all', label: 'All Time', icon: BarChart3 },
    { id: 'month', label: 'This Month', icon: TrendingUp },
    { id: 'week', label: 'This Week', icon: TrendingUp }
  ];

  const categoryFilters = [
    { id: 'all', label: 'Overall', icon: Trophy },
    { id: 'ecoPoints', label: 'Eco Points', icon: Leaf },
    { id: 'carbonSaved', label: 'Carbon Saved', icon: Leaf },
    { id: 'products', label: 'Products', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EcoBAZZARX Leaderboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compete with eco-conscious shoppers and climb the ranks by making sustainable choices. 
            Every purchase counts towards your environmental impact score!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-eco-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Time Period</h3>
              <div className="flex gap-2">
                {timeFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setTimeFilter(filter.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        timeFilter === filter.id
                          ? 'bg-eco-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Ranking Category</h3>
              <div className="flex gap-2">
                {categoryFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setCategoryFilter(filter.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        categoryFilter === filter.id
                          ? 'bg-eco-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Current User Status */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-eco-500 to-eco-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Your Current Rank</h3>
                  <p className="text-eco-100">Keep making eco-friendly choices to climb higher!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">#{currentUserRank.rank}</div>
                <div className="text-eco-100">{currentUserRank.ecoPoints} eco points</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl border border-eco-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Top Eco Warriors</h2>
            <p className="text-gray-600">The most environmentally conscious shoppers this {timeFilter === 'all' ? 'year' : timeFilter}</p>
          </div>

          <div className="divide-y divide-gray-200">
            {topUsers.map((entry) => (
              <div 
                key={entry.userId}
                className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                  entry.userId === user?.id ? 'bg-eco-50 border-l-4 border-l-eco-500' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.userName}
                        {entry.userId === user?.id && (
                          <span className="ml-2 text-xs bg-eco-600 text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-eco-500" />
                        <span className="text-gray-600">{entry.ecoPoints} eco points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">{entry.totalCarbonSaved.toFixed(1)} kg CO₂ saved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600">{entry.productsPurchased} products</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-eco-600">{entry.ecoPoints}</div>
                    <div className="text-sm text-gray-500">total points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-xl shadow-lg border border-eco-200 p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Earn Eco Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-eco-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Low Carbon Products</h4>
              <p className="text-sm text-gray-600">Earn more points for products with lower environmental impact</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Regular Purchases</h4>
              <p className="text-sm text-gray-600">Build your eco-friendly shopping habits</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
              <p className="text-sm text-gray-600">Unlock badges and bonus points for milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
