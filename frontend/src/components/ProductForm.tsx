import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { 
  Package, 
  DollarSign, 
  Leaf, 
  Star, 
  Image as ImageIcon, 
  Tag, 
  FileText,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { addProduct, updateProduct } from '../services/ProductService';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    stock: '',
    carbonFootprint: '',
    category: '',
    rating: '5',
    reviews: '0',
    sustainablePackaging: false,
    unitsSold: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Media',
    'Food & Beverages',
    'Automotive',
    'Health & Wellness',
    'Toys & Games'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        brand: product.brand || '',
        stock: product.stock?.toString() || '',
        carbonFootprint: product.carbonFootprint.toString(),
        category: product.category,
        rating: product.rating.toString(),
        reviews: product.reviews?.toString() || '0',
        sustainablePackaging: !!product.sustainablePackaging,
        unitsSold: product.unitsSold?.toString() || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
  setImagePreview(product.image ?? "");
      setImageFile(null);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && 'checked' in target) {
      fieldValue = (target as HTMLInputElement).checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       // Rename file to avoid conflicts
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.carbonFootprint || parseFloat(formData.carbonFootprint) < 0) {
      newErrors.carbonFootprint = 'Valid carbon footprint is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!imagePreview && !imageFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      // Prepare product data (exclude image)
      let imageUrl = imagePreview;
      let productId = product ? product.id : null;
      // Build product data in the required backend format
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        brand: formData.brand.trim(),
        sellerId: '1', // Set sellerId as needed (e.g., from context or user)
        category: formData.category,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        carbonFootprint: parseFloat(formData.carbonFootprint),
        sustainablePackaging: !!formData.sustainablePackaging,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        imageUrl: imageUrl || null,
        isActive: !!formData.isActive,
        unitsSold: formData.unitsSold ? parseInt(formData.unitsSold) : 0,
        // createdAt and updatedAt are set by backend
      };
      console.log('Sending product data to backend:', productData);
      if (product) {
        await updateProduct(Number(product.id), { ...productData, image: imageUrl });
        productId = product.id;
      } else {
        // 1. Add product (without image)
        const response = await addProduct({ ...productData, image: '' });
        productId = response.id;
      }
      // 2. Upload image if new image file selected and productId exists
      if (imageFile && productId) {
        const extension = imageFile.name.split('.').pop();
    const newName = `${productId}.${extension}`;
    const renamedFile = new File([imageFile], newName, { type: imageFile.type });
    setImageFile(renamedFile);
    setImagePreview(URL.createObjectURL(renamedFile));
        const formDataImg = new FormData();
        formDataImg.append('image', imageFile);
        // Use the correct backend endpoint for image upload
        const uploadResponse = await fetch(`http://localhost:8090/api/products/${productId}/upload`, {
          method: 'POST',
          body: formDataImg
        });
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          imageUrl = data.image || imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }
      onSave({ ...productData, image: imageUrl });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error instanceof Error ? error.message : error));
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          </div>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Describe your eco-friendly product..."
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Price, Brand, Stock, Carbon Footprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors ${
                errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            className="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
            placeholder="Brand name"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="carbonFootprint" className="block text-sm font-medium text-gray-700 mb-2">
            Carbon Footprint (g CO₂) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Leaf className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="carbonFootprint"
              name="carbonFootprint"
              type="number"
              step="0.1"
              min="0"
              value={formData.carbonFootprint}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors ${
                errors.carbonFootprint ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.0"
            />
          </div>
          {errors.carbonFootprint && (
            <p className="mt-1 text-sm text-red-600">{errors.carbonFootprint}</p>
          )}
        </div>
      </div>
      {/* Sustainable Packaging, Units Sold, Active */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-2 mt-2">
          <input
            id="sustainablePackaging"
            name="sustainablePackaging"
            type="checkbox"
            checked={formData.sustainablePackaging}
            onChange={handleChange}
            className="h-5 w-5 text-eco-600 border-gray-300 rounded focus:ring-eco-500"
          />
          <label htmlFor="sustainablePackaging" className="text-sm font-medium text-gray-700">
            Sustainable Packaging
          </label>
        </div>
        <div>
          <label htmlFor="unitsSold" className="block text-sm font-medium text-gray-700 mb-2">
            Units Sold
          </label>
          <input
            id="unitsSold"
            name="unitsSold"
            type="number"
            min="0"
            value={formData.unitsSold}
            onChange={handleChange}
            className="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
            placeholder="0"
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 text-eco-600 border-gray-300 rounded focus:ring-eco-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
      </div>

      {/* Category and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors ${
                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Initial Rating
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-transparent transition-colors"
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image *
        </label>
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-eco-400 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-eco-600 hover:text-eco-700 font-medium">Click to upload</span>
                  {' '}or drag and drop
                </label>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      {/* Eco-friendly Tips */}
      <div className="bg-gradient-to-r from-eco-50 to-blue-50 border border-eco-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-eco-800 mb-1">Eco-Friendly Product Tips</h4>
            <ul className="text-sm text-eco-700 space-y-1">
              <li>• Use sustainable materials and packaging</li>
              <li>• Minimize carbon footprint in production</li>
              <li>• Provide clear environmental benefits</li>
              <li>• Include recycling/disposal instructions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="gradient-button-primary flex items-center space-x-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{product ? 'Update Product' : 'Add Product'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
