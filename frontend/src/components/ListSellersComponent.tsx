import { useEffect, useState } from "react";
import { listSellers, getSellerById } from "../services/SellerService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  carbonFootprint: number;
  unitsSold: number;
  rating: number;
}

interface Certification {
  name: string;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  brandName: string;
  email: string;
  phone: string;
  website?: string;
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  profilePicture?: string;
  
  // Eco-Performance Metrics
  totalCarbonEmission: number;
  co2Saved: number;
  totalUnitsSold: number;
  sustainablePackagingPercent: number;
  
  // Product Details
  products: Product[];
  bestSellingProduct?: Product;
  averageRating: number;
  
  // Analytics
  monthlyStats: {
    month: string;
    sales: number;
    co2Emissions: number;
  }[];
  impactBadges: string[];
  
  // Certifications
  certifications: Certification[];
  isVerified: boolean;
  
  // Community Engagement
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewer: string;
  }[];
  sustainabilityContributions: {
    type: string;
    amount: number;
    date: string;
    description: string;
  }[];
}

const ListSellersComponent = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = () => {
    setLoading(true);
    listSellers()
      .then((response) => {
        const transformedSellers = response.data.map((seller: any) => ({
          id: seller.id,
          firstName: seller.firstName,
          lastName: seller.lastName,
          email: seller.email,
          phone: seller.phone
        }));
        setSellers(transformedSellers);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const transformSellerData = (rawData: any): Seller => {
    // Transform the basic data we have
    const transformedData: Seller = {
      id: rawData.id,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      brandName: rawData.brandName || `${rawData.firstName}'s Store`,
      email: rawData.email,
      phone: rawData.phone,
      website: rawData.website,
      location: {
        city: rawData.city || 'Unknown City',
        country: rawData.country || 'Unknown Country',
      },
      profilePicture: rawData.profilePicture,
      
      // Default values for eco-metrics
      totalCarbonEmission: rawData.totalCarbonEmission || 0,
      co2Saved: rawData.co2Saved || 0,
      totalUnitsSold: rawData.totalUnitsSold || 0,
      sustainablePackagingPercent: rawData.sustainablePackagingPercent || 0,
      
      // Empty arrays for products and other data
      products: rawData.products || [],
      bestSellingProduct: rawData.bestSellingProduct || null,
      averageRating: rawData.averageRating || 0,
      
      monthlyStats: rawData.monthlyStats || [],
      impactBadges: rawData.impactBadges || ['New Eco-Seller'],
      
      certifications: rawData.certifications || [],
      isVerified: rawData.isVerified || false,
      
      reviews: rawData.reviews || [],
      sustainabilityContributions: rawData.sustainabilityContributions || []
    };
    
    return transformedData;
  };

  const handleSellerClick = async (sellerId: number) => {
    try {
      const response = await getSellerById(sellerId);
      const transformedSeller = transformSellerData(response.data);
      setSelectedSeller(transformedSeller);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-center">Sellers List</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sellers...</p>
          </div>
        ) : (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="text-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-lg border-b-2 border-gray-200">
                    Seller ID
                  </th>
                  <th className="p-4 font-semibold text-lg border-b-2 border-gray-200">
                    First Name
                  </th>
                  <th className="p-4 font-semibold text-lg border-b-2 border-gray-200">
                    Last Name
                  </th>
                  <th className="p-4 font-semibold text-lg border-b-2 border-gray-200">
                    Email
                  </th>
                  <th className="p-4 font-semibold text-lg border-b-2 border-gray-200">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr
                    key={seller.id}
                    onClick={() => handleSellerClick(seller.id)}
                    className="bg-white hover:bg-gray-50 transition-colors duration-200 ease-in-out border-b border-gray-200 last:border-b-0 cursor-pointer"
                  >
                    <td className="p-4 text-sm text-gray-800">{seller.id}</td>
                    <td className="p-4 text-sm text-gray-800">{seller.firstName}</td>
                    <td className="p-4 text-sm text-gray-800">{seller.lastName}</td>
                    <td className="p-4 text-sm text-gray-800">{seller.email}</td>
                    <td className="p-4 text-sm text-gray-800">{seller.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seller Detail Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg relative">
              <button
                onClick={() => setSelectedSeller(null)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold">Seller Details</h3>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Basic Info Section */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  📋 Basic Information
                  {selectedSeller.isVerified && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">✅ Verified Seller</span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex items-center gap-4">
                    {selectedSeller.profilePicture ? (
                      <img src={selectedSeller.profilePicture} alt="Seller" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div>
                      <h5 className="text-xl font-bold text-gray-900">{selectedSeller.brandName}</h5>
                      <p className="text-gray-600">{selectedSeller.firstName} {selectedSeller.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Contact Information</label>
                    <p className="text-gray-800">📧 {selectedSeller.email}</p>
                    <p className="text-gray-800">📱 {selectedSeller.phone}</p>
                    {selectedSeller.website && (
                      <p className="text-gray-800">🌐 {selectedSeller.website}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="text-gray-800">🏢 {selectedSeller.location.city}</p>
                    <p className="text-gray-800">🌎 {selectedSeller.location.country}</p>
                  </div>
                </div>
              </div>

              {/* Eco-Performance Metrics */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">🌱 Eco-Performance Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Carbon Emission</p>
                    <p className="text-2xl font-bold text-green-700">{selectedSeller.totalCarbonEmission.toLocaleString()} kg</p>
                    <p className="text-xs text-green-600">CO₂</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-blue-700">{selectedSeller.co2Saved.toLocaleString()} kg</p>
                    <p className="text-xs text-blue-600">Through eco-methods</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Units Sold</p>
                    <p className="text-2xl font-bold text-purple-700">{selectedSeller.totalUnitsSold.toLocaleString()}</p>
                    <p className="text-xs text-purple-600">Total Products</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Sustainable Packaging</p>
                    <p className="text-2xl font-bold text-yellow-700">{selectedSeller.sustainablePackagingPercent}%</p>
                    <p className="text-xs text-yellow-600">Eco-friendly</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">📦 Product Details</h4>
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Best Selling Product</h5>
                    {selectedSeller.bestSellingProduct && (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{selectedSeller.bestSellingProduct.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedSeller.bestSellingProduct.unitsSold.toLocaleString()} units sold
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600 font-medium">
                            {selectedSeller.bestSellingProduct.carbonFootprint} kg CO₂
                          </p>
                          <div className="flex items-center text-yellow-500">
                            {'★'.repeat(Math.floor(selectedSeller.bestSellingProduct.rating))}
                            <span className="text-gray-400">
                              {'★'.repeat(5 - Math.floor(selectedSeller.bestSellingProduct.rating))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {selectedSeller.certifications.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">🏆 Certifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSeller.certifications.map((cert, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{cert.name}</p>
                        <p className="text-sm text-gray-600">Valid until: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          cert.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Badges */}
              {selectedSeller.impactBadges.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">🎖️ Impact Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeller.impactBadges.map((badge, index) => (
                      <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Engagement */}
              {selectedSeller.sustainabilityContributions.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">👥 Community Impact</h4>
                  <div className="space-y-4">
                    {selectedSeller.sustainabilityContributions.map((contribution, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{contribution.type}</p>
                            <p className="text-sm text-gray-600">{contribution.description}</p>
                          </div>
                          <p className="text-green-600 font-medium">
                            {contribution.amount} {contribution.type.includes('Trees') ? 'trees' : 'units'}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(contribution.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSellersComponent;