import React, { useEffect, useState } from 'react';


import { fetchAllProducts } from '../services/ProductService';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';


interface ProductGridProps {
  onProductClick?: (product: any) => void;
  category?: string[];
  // Accept key prop for refresh
  key?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick, category, key }) => {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAllProducts()
      .then(products => {
        interface Product {
          id: number;
          name: string;
          category: string;
          [key: string]: any;
        }

        const filtered: Product[] = category && category.length > 0
          ? (products as Product[]).filter((product: Product) => category.includes(product.category))
          : (products as Product[]);
        setFilteredProducts(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key, category]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">No products available in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductGrid;
