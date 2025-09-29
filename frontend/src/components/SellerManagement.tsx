import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ShieldBan, CheckCircle2, MoreVertical, ArrowLeft } from "lucide-react";

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
  sold: number; // Number of units sold
}

const SellerManagement: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [products, setProducts] = useState<Product[]>([]); // Mock / replace with context
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerStats, setSellerStats] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Example data (remove if using context)
    setProducts([
      { id: "1", name: "Eco Bottle", sellerId: "SellerA", carbonFootprint: 1.2, sold: 120 },
      { id: "2", name: "Bamboo Brush", sellerId: "SellerB", carbonFootprint: 0.5, sold: 200 },
      { id: "3", name: "Recycled Bag", sellerId: "SellerA", carbonFootprint: 0.8, sold: 150 },
    ]);
  }, []);

  useEffect(() => {
    const sellerMap: Record<string, Seller> = {};
    products.forEach((product: Product) => {
      if (product.sellerId && !sellerMap[product.sellerId]) {
        sellerMap[product.sellerId] = {
          id: product.sellerId,
          name: product.sellerId,
          status: "active",
        };
      }
    });
    setSellers(Object.values(sellerMap));

    const stats: Record<string, number> = {};
    products.forEach((product: Product) => {
      if (product.sellerId) {
        stats[product.sellerId] =
          (stats[product.sellerId] || 0) +
          product.carbonFootprint * (product.sold || 0);
      }
    });
    setSellerStats(stats);
  }, [products]);

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
