import React from 'react';
import { useProductContext } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Leaf, Package, TrendingUp } from 'lucide-react';

interface ProductGridProps {
  onProductClick?: (product: any) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const { filteredProducts, products } = useProductContext();

  const getEcoStats = () => {
    const lowImpactCount = products.filter(p => p.carbonFootprint <= 1.5).length;
    const veryLowImpactCount = products.filter(p => p.carbonFootprint <= 0.8).length;
    const totalProducts = products.length;
    
    return {
      lowImpactCount,
      veryLowImpactCount,
      totalProducts,
      lowImpactPercentage: Math.round((lowImpactCount / totalProducts) * 100),
      veryLowImpactPercentage: Math.round((veryLowImpactCount / totalProducts) * 100)
    };
  };

  const stats = getEcoStats();

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters to see more products.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Eco Stats Banner */}
      <div className="bg-gradient-to-r from-eco-500 to-eco-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">EcoBAZZARX Impact</h3>
              <p className="text-eco-100 text-sm">
                {stats.lowImpactPercentage}% of our products have low environmental impact
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.lowImpactCount}</div>
            <div className="text-eco-100 text-sm">Low Impact Products</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Carbon Footprint Distribution</span>
            <span>{stats.veryLowImpactPercentage}% Very Low Impact</span>
          </div>
          <div className="w-full bg-eco-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.veryLowImpactPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Sorted by {filteredProducts.length > 0 ? 'environmental impact' : 'default'}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
        ))}
      </div>

      {/* Bottom Eco Message */}
      <div className="mt-12 text-center py-8 bg-eco-50 rounded-xl border border-eco-200">
        <Leaf className="w-12 h-12 text-eco-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-eco-800 mb-2">
          Make a Difference with Every Purchase
        </h3>
        <p className="text-eco-700 max-w-2xl mx-auto">
          By choosing products with lower carbon footprints, you're contributing to a more sustainable future. 
          Every eco-friendly choice counts towards reducing our collective environmental impact.
        </p>
      </div>
    </div>
  );
};

export default ProductGrid;
