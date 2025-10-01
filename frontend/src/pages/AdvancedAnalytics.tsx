import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {  TrendingUp,  PieChart } from "lucide-react";
import { useProductContext } from "../context/ProductContext";
import { Product } from '../types/product';

// Simple chart component for category breakdown
const CategoryPie: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const colors = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"];
  let startAngle = 0;
  const radius = 60;
  const center = 70;
  const keys = Object.keys(data);
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {keys.map((cat, i) => {
        const value = data[cat];
        const angle = (value / total) * 2 * Math.PI;
        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        startAngle += angle;
        const x2 = center + radius * Math.cos(startAngle);
        const y2 = center + radius * Math.sin(startAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        return (
          <path
            key={cat}
            d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
            fill={colors[i % colors.length]}
            stroke="#fff"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
};

const AdvancedAnalytics: React.FC = () => {
  const { products = [] }: { products: Product[] } = useProductContext?.() || {};
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState<Record<string, number>>({});
  const [sellerLeaderboard, setSellerLeaderboard] = useState<Record<string, number>>({});

  useEffect(() => {
    // Category breakdown
    const catStats: Record<string, number> = {};
    products.forEach((p) => {
      catStats[p.category] = (catStats[p.category] || 0) + (p.unitsSold || 0);
    });
    setCategoryData(catStats);
    // Seller leaderboard
    const sellerStats: Record<string, number> = {};
    products.forEach((p) => {
      if (p.sellerId) sellerStats[p.sellerId] = (sellerStats[p.sellerId] || 0) + (p.unitsSold || 0);
    });
    setSellerLeaderboard(sellerStats);
  }, [products]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PieChart className="w-6 h-6 text-eco-600" /> Category Breakdown
      </h2>
      <div className="flex gap-8 items-center mb-8">
        <CategoryPie data={categoryData} />
        <ul>
          {Object.entries(categoryData).map(([cat, val], i) => (
            <li key={cat} className="flex items-center gap-2 mb-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"][i % 6] }}></span>
              <span className="font-medium">{cat}</span>
              <span className="text-gray-500">{val} sold</span>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" /> Seller Leaderboard
      </h2>
      <div className="bg-white rounded-xl shadow p-6">
        <ul>
          {Object.entries(sellerLeaderboard)
            .sort((a, b) => b[1] - a[1])
            .map(([seller, sold]) => (
              <li key={seller} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{seller}</span>
                <span className="text-gray-500">Sold: {sold}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
