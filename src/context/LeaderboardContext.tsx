import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LeaderboardEntry } from '../types/auth';

interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  updateUserPoints: (userId: string, ecoPoints: number, carbonSaved: number, productsPurchased: number) => void;
  getUserRank: (userId: string) => number;
  getTopUsers: (limit: number) => LeaderboardEntry[];
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

interface LeaderboardProviderProps {
  children: ReactNode;
}

export const LeaderboardProvider: React.FC<LeaderboardProviderProps> = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Load leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('ecobazzarx_leaderboard');
    if (savedLeaderboard) {
      try {
        const data = JSON.parse(savedLeaderboard);
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      }
    } else {
      // Initialize with sample data
      const initialLeaderboard: LeaderboardEntry[] = [
        {
          userId: '1',
          userName: 'Eco Warrior',
          ecoPoints: 1250,
          totalCarbonSaved: 45.2,
          productsPurchased: 23,
          rank: 1
        },
        {
          userId: '2',
          userName: 'Green Thumb',
          ecoPoints: 980,
          totalCarbonSaved: 38.7,
          productsPurchased: 18,
          rank: 2
        },
        {
          userId: '3',
          userName: 'Nature Lover',
          ecoPoints: 750,
          totalCarbonSaved: 29.4,
          productsPurchased: 15,
          rank: 3
        },
        {
          userId: '4',
          userName: 'Sustainable Shopper',
          ecoPoints: 620,
          totalCarbonSaved: 24.1,
          productsPurchased: 12,
          rank: 4
        },
        {
          userId: '5',
          userName: 'Eco Explorer',
          ecoPoints: 480,
          totalCarbonSaved: 19.8,
          productsPurchased: 10,
          rank: 5
        }
      ];
      setLeaderboard(initialLeaderboard);
      localStorage.setItem('ecobazzarx_leaderboard', JSON.stringify(initialLeaderboard));
    }
  }, []);

  const updateUserPoints = (userId: string, ecoPoints: number, carbonSaved: number, productsPurchased: number) => {
    setLeaderboard(prev => {
      const updated = prev.map(entry => 
        entry.userId === userId 
          ? { ...entry, ecoPoints, totalCarbonSaved: carbonSaved, productsPurchased }
          : entry
      );
      
      // Sort by eco points and update ranks
      const sorted = updated.sort((a, b) => b.ecoPoints - a.ecoPoints);
      const ranked = sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      // Save to localStorage
      localStorage.setItem('ecobazzarx_leaderboard', JSON.stringify(ranked));
      return ranked;
    });
  };

  const getUserRank = (userId: string): number => {
    const user = leaderboard.find(entry => entry.userId === userId);
    return user ? user.rank : 0;
  };

  const getTopUsers = (limit: number): LeaderboardEntry[] => {
    return leaderboard.slice(0, limit);
  };

  const value: LeaderboardContextType = {
    leaderboard,
    updateUserPoints,
    getUserRank,
    getTopUsers
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
