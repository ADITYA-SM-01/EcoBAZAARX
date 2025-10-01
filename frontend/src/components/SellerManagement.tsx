import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Leaf, ShieldBan, CheckCircle2, MoreVertical, ArrowLeft, Package } from "lucide-react";

interface Seller {
  id: string;
  name: string;
  status: "active" | "restricted";
}

interface Product {
  id: string;
  name: string;
  sellerId: string;
  carbonFootprint: number;
  sold: number;
  price: number;
  description: string;
  image?: string;
  category: string;
  brand?: string;
  stock: number;
  sustainablePackaging: boolean;
  rating: number;
  reviews: number;
  unitsSold: number;
  isActive: boolean;
}

const SellerManagement: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  console.log('SellerManagement mounted');
  const { currentUser } = useAuth();
  console.log('currentUser at mount:', currentUser);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerStats, setSellerStats] = useState<Record<string, number>>({});
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch seller's products from API
  useEffect(() => {
    console.log('useEffect for fetchUserProducts running. currentUser:', currentUser);
    const fetchUserProducts = async () => {
      if (!currentUser?.id) {
        console.log('No currentUser.id available:', currentUser);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching products for seller ID:', currentUser.id);
        const response = await fetch(`http://localhost:8090/api/products/seller/${currentUser.id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('API Response:', response.status, response.statusText);
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = JSON.parse(responseText);
        console.log('Parsed products:', data);
        
        if (!Array.isArray(data)) {
          console.warn('API did not return an array:', data);
          setUserProducts([]);
        } else {
          setUserProducts(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load products: ${errorMessage}`);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, [currentUser?.id]);

  // Calculate seller stats from user products
  useEffect(() => {
    if (!currentUser?.id || !userProducts.length) return;

    const totalCarbonImpact = userProducts.reduce((total, product) => 
      total + (product.carbonFootprint * (product.unitsSold || 0)), 0);

    setSellers([{
      id: currentUser.id,
      name: currentUser.name,
      status: "active",
    }]);

    setSellerStats({
      [currentUser.id]: totalCarbonImpact
    });
  }, [currentUser?.id, userProducts]);

  const toggleRestriction = (id: string) => {
    setSellers((prev) =>
      prev.map((seller) =>
        seller.id === id
          ? { ...seller, status: seller.status === "active" ? "restricted" : "active" }
          : seller
      )
    );
    setMenuOpen(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack ? onBack : () => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Seller Management</h2>

      {/* Your Products Section */}
      {currentUser && currentUser.role === 'seller' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Products</h3>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your products...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {!isLoading && !error && userProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="w-full">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="mt-2 text-sm text-gray-600 space-y-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span>{product.carbonFootprint} kg CO₂</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Price: ${product.price}</span>
                          <span>Stock: {product.stock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Units Sold: {product.unitsSold || 0}</span>
                          <span>Rating: {product.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No products found</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sellers.map((seller) => {
          const emissions = sellerStats[seller.id] || 0;
          const highEmission = emissions > 500;

          return (
            <div
              key={seller.id}
              className={`rounded-2xl shadow-md border p-6 relative bg-white transition hover:shadow-lg ${
                highEmission ? "border-red-400" : "border-gray-200"
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                <div className="relative">
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => setMenuOpen(menuOpen === seller.id ? null : seller.id)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {menuOpen === seller.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-20">
                      <button
                        onClick={() => toggleRestriction(seller.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {seller.status === "active" ? "Restrict Seller" : "Unrestrict Seller"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="font-medium">
                    CO₂ Emission:{" "}
                    <span className={highEmission ? "text-red-600 font-bold" : "text-gray-800"}>
                      {emissions.toFixed(2)} kg
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {seller.status === "active" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-green-100 text-green-700 border border-green-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-red-100 text-red-700 border border-red-300">
                      <ShieldBan className="w-4 h-4" />
                      Restricted
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerManagement;
