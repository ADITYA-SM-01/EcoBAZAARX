import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';
import { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { 
  Plus, 
  Package, 
  TrendingUp,  
  Edit, 
  Trash2,  
  Search,
  SortAsc,
  Star,
  Leaf,
  Settings,
  Bell,
  User,
  LogOut,
  ArrowLeft,
  X
} from 'lucide-react';
import SearchBar from './SearchBar';
import { getImageUrl } from '../services/ProductService';

interface DashboardStats {
  totalProducts: number;
  activeListings: number;
  outOfStock: number;
  totalSales: number;
  totalRevenue: number;
  avgProductRating: number;
  totalViews: number;
  carbonSaved: number;
  ecoRating: number;
  sustainableProducts: number;
}

const SellerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { addProduct, updateProduct, deleteProduct } = useProductContext();
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'carbonFootprint'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch seller products (refetchable)
  const fetchSellerProducts = async () => {
    if (!user?.id) {
      console.log('No user.id available:', user);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching products for seller ID:', user.id);
      const response = await fetch(`http://localhost:8090/api/products/seller/${user.id}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      if (Array.isArray(data)) {
        setSellerProducts(data);
      } else {
        console.warn('API did not return an array:', data);
        setSellerProducts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load products: ${errorMessage}`);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [user?.id]);

  // Calculate dashboard stats based on seller's products
  const calculateStats = () => {
    return {
      totalProducts: sellerProducts.length,
      activeListings: sellerProducts.filter(p => p.isActive !== false && p.stock > 0).length,
      outOfStock: sellerProducts.filter(p => p.stock === 0).length,
      totalSales: sellerProducts.reduce((total, product) => total + (product.unitsSold || 0), 0),
      totalRevenue: sellerProducts.reduce((total, product) => total + ((product.price || 0) * (product.unitsSold || 0)), 0),
      avgProductRating: sellerProducts.length > 0
        ? sellerProducts.reduce((total, product) => total + (product.rating || 0), 0) / sellerProducts.length
        : 0,
      totalViews: sellerProducts.reduce((total, product) => total + (product.reviews || 0), 0),
      carbonSaved: sellerProducts.reduce((total, product) => total + (product.rating || 0) * (product.reviews || 0), 0),
      ecoRating: sellerProducts.length > 0
        ? Math.round(sellerProducts.reduce((total, product) => total + (product.rating || 0), 0) / sellerProducts.length)
        : 0,
      sustainableProducts: sellerProducts.filter(p => (p.rating || 0) >= 4).length
    };
  };

  const [stats, setStats] = useState<DashboardStats>(calculateStats());

  // Update stats when products change
  useEffect(() => {
    setStats(calculateStats());
  }, [sellerProducts]);

  const filteredProducts = sellerProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    if (sortBy === 'name') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const categories = ['All', ...Array.from(new Set(sellerProducts.map(p => p.category)))];


  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
      await fetchSellerProducts();
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need seller privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-eco-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your eco-friendly products</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalogue</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Product Stats */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-green-600">{stats.activeListings} Active</p>
                  <p className="text-sm text-red-600">{stats.outOfStock} Out of Stock</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Sales Stats */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Performance</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{stats.totalSales} Items Sold</p>
                  <p className="text-sm text-gray-600">{stats.totalViews} Product Views</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Rating Stats */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProductRating.toFixed(1)} / 5.0</p>
                <div className="mt-2 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Sustainability Stats */}
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Sustainability Impact</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ecoRating} / 5.0</p>
                <div className="mt-2">
                  <p className="text-sm text-green-600">{stats.sustainableProducts} Eco-friendly Products</p>
                  <p className="text-sm text-green-600">{Math.round(stats.carbonSaved)}kg CO₂ Saved</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="eco-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <SearchBar
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(term) => setSearchTerm(term)}
                onClear={() => setSearchTerm('')}
                className="w-80"
                showSuggestions={true}
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="carbonFootprint">Carbon Footprint</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddProduct(true)}
              className="gradient-button-primary flex items-center space-x-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="eco-card p-6">
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

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Products</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{sortedProducts.length} products</span>
                  <span>•</span>
                  <span>Showing {Math.min(sortedProducts.length, 12)} of {sortedProducts.length}</span>
                </div>
              </div>

              {/* Search Results Summary */}
              {searchTerm && searchTerm.trim() !== '' && (
                <div className="mb-6 p-4 bg-eco-50 border border-eco-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-eco-700">
                      <Search className="w-5 h-5" />
                      <span className="font-medium">
                        Search Results: {sortedProducts.length} products found for "{searchTerm}"
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-eco-600 hover:text-eco-800 transition-colors text-sm"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first eco-friendly product.</p>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="gradient-button-primary flex items-center space-x-2 px-6 py-3 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Product</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.slice(0, 12).map((product) => (
                    <div key={product.id} className="eco-card p-4 product-card-hover">
                      <div className="relative mb-4">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(String(product.id))}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-eco-600">${product.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span className="capitalize">{product.category}</span>
                        <div className="flex items-center space-x-1">
                          <Leaf className="w-4 h-4 text-eco-500" />
                          <span>{product.carbonFootprint}g CO₂</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{product.reviews} reviews</span>
                        <span>ID: {String(product.id).slice(0, 8)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <ProductForm
                product={editingProduct}
                onSave={async (formProduct) => {
                  const productToSave = {
                    ...formProduct,
                    ...(editingProduct ? { id: editingProduct.id } : {}),
                  };
                  if (editingProduct) {
                    await updateProduct(String(editingProduct.id), productToSave);
                  } else {
                    await addProduct(productToSave);
                  }
                  await fetchSellerProducts();
                  setShowAddProduct(false);
                  setEditingProduct(null);
                }}
                onCancel={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
