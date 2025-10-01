import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { LikesProvider } from './context/LikesContext';
import AuthRouter from './components/AuthRouter';
import ProductCatalogue from './pages/ProductCatalogue';
import ProfilePage from './pages/ProfilePage';
import SellerDashboard from './components/SellerDashboard';
import { useAuth } from './context/AuthContext';
import PaymentPage from './pages/PaymentPage';
import SellerManagement from './components/SellerManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import AdminSellerManagement from './components/AdminSellerManagement';
import PageTransition from './components/PageTransition';
import SettingsPage from './pages/SettingsPage';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <ProductProvider>
              <LeaderboardProvider>
                <LikesProvider>
                  <Router>
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-screen"
                      >
                        <AppRoutes />
                      </motion.div>
                    </AnimatePresence>
                  </Router>
                </LikesProvider>
              </LeaderboardProvider>
            </ProductProvider>
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 flex items-center justify-center">
          <div className="loading-shimmer rounded-full p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eco-600"></div>
            <p className="text-eco-600 font-medium animate-pulse">Loading EcoBazaarX...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthRouter />} />
        ) : (
          <>
            {/* Common routes for all authenticated users */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<ProductCatalogue />} />

            {/* Admin-specific routes */}
            {user.role === 'admin' && (
              <>
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/advanced-analytics" element={<AdvancedAnalytics />} />
                <Route path="/admin/sellers" element={<AdminSellerManagement />} />
              </>
            )}
            
            {/* Seller-specific routes */}
            {user.role === 'seller' && (
              <>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/management" element={<SellerManagement />} />
                <Route path="/seller/analytics" element={<AnalyticsPage />} />
              </>
            )}
            
            {/* Customer-specific routes */}
            {user.role === 'customer' && (
              <>
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/orders" element={<Navigate to="/profile?tab=orders" replace />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </>
            )}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </PageTransition>
  );
}

export default App;