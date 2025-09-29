import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Leaf } from "lucide-react";
import { useProductContext } from "../context/ProductContext";

interface Product {
  id: string;
  name: string;
  price: number;
  carbonFootprint: number;
  sold?: number;
  category: string;
}

const AnalyticsPage: React.FC = () => {
  const { products = [] } = useProductContext?.() || {};
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayCO2, setDisplayCO2] = useState(0);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    let revenue = 0;
    let co2 = 0;
    const sorted = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));
    setTopProducts(sorted.slice(0, 3));
    products.forEach((p) => {
      revenue += (p.price || 0) * (p.sold || 0);
      co2 += (p.carbonFootprint || 0) * (p.sold || 0);
    });
    setTotalRevenue(revenue);
    setTotalCO2(co2);
  }, [products]);

  // Animate counters
  useEffect(() => {
    let revStart = 0;
    let co2Start = 0;
    const revStep = (totalRevenue - revStart) / 30;
    const co2Step = (totalCO2 - co2Start) / 30;
    let frame = 0;
    const animate = () => {
      frame++;
      revStart += revStep;
      co2Start += co2Step;
      setDisplayRevenue(frame < 30 ? revStart : totalRevenue);
      setDisplayCO2(frame < 30 ? co2Start : totalCO2);
      if (frame < 30) requestAnimationFrame(animate);
    };
    animate();
  }, [totalRevenue, totalCO2]);

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
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <BarChart3 className="w-7 h-7 text-eco-600" /> Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div 
          className="bg-white rounded-xl shadow p-6" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <motion.div 
            className="text-2xl font-bold text-green-700"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.6 }}
          >
            ${displayRevenue.toFixed(2)}
          </motion.div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-xl shadow p-6" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2">Total CO₂ Emissions</h3>
          <motion.div 
            className="text-2xl font-bold text-eco-600 flex items-center gap-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.6 }}
          >
            <Leaf className="w-5 h-5" />
            {displayCO2.toFixed(2)} kg
          </motion.div>
        </motion.div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Top Selling Products
        </h3>
        <ul>
          {topProducts.map((p) => (
            <li key={p.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="font-medium">{p.name}</span>
              <span className="text-gray-500">Sold: {p.sold || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPage;
