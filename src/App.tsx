
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { LikesProvider } from './context/LikesContext';
import AuthRouter from './components/AuthRouter';
import ProductCatalogue from './pages/ProductCatalogue';
import SellerDashboard from './components/SellerDashboard';
import { useAuth } from './context/AuthContext';
import PaymentPage from './pages/PaymentPage';

function App() {
  console.log('App component rendering...');
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <LeaderboardProvider>
              <LikesProvider>
                <Router>
                  <AppRoutes />
                </Router>
              </LikesProvider>
            </LeaderboardProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Separate component for routes to use hooks
function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <AuthRouter />;
  }

  return (
    <Routes>
      <Route path="/" element={<ProductCatalogue />} />
      <Route 
        path="/seller-dashboard" 
        element={
          user?.role === 'seller' ? (
            <SellerDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
