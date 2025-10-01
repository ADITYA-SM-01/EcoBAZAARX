import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Leaf, Package, PieChart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";
import { Product } from '../types/product';
import {
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SalesData {
  date: string;
  revenue: number;
  units: number;
}

interface CategoryData {
  name: string;
  value: number;
  revenue: number;
  [key: string]: string | number;
}

const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#f59e0b', '#ef4444'];

const AnalyticsPage: React.FC = () => {
  const { products = [] } = useProductContext?.() || {};
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayCO2, setDisplayCO2] = useState(0);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Calculate total revenue and CO2
    let revenue = 0;
    let co2 = 0;
    const sorted = [...products].sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
    setTopProducts(sorted.slice(0, 5));
    
    // Generate category data
    const categoryMap = new Map<string, { units: number; revenue: number }>();
    products.forEach((p) => {
      revenue += (p.price || 0) * (p.unitsSold || 0);
      co2 += (p.carbonFootprint || 0) * (p.unitsSold || 0);

      // Update category data
      const categoryInfo = categoryMap.get(p.category) || { units: 0, revenue: 0 };
      categoryInfo.units += p.unitsSold || 0;
      categoryInfo.revenue += (p.price || 0) * (p.unitsSold || 0);
      categoryMap.set(p.category, categoryInfo);
    });

    // Transform category data for chart
    setCategoryData(
      Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        value: data.units,
        revenue: data.revenue
      }))
    );

    setTotalRevenue(revenue);
    setTotalCO2(co2);

    // Generate mock sales trend data
    const today = new Date();
    const trendData: SalesData[] = [];
    const daysToShow = selectedTimeRange === 'week' ? 7 : selectedTimeRange === 'month' ? 30 : 12;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (daysToShow - i - 1));
      trendData.push({
        date: selectedTimeRange === 'year' 
          ? date.toLocaleString('default', { month: 'short' })
          : date.toLocaleDateString(),
        revenue: Math.floor(Math.random() * (revenue / daysToShow) * 1.5),
        units: Math.floor(Math.random() * 50)
      });
    }
    setSalesTrend(trendData);
  }, [products, selectedTimeRange]);

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

  const timeRangeOptions = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-eco-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <BarChart3 className="w-7 h-7 text-eco-600" /> Sales Analytics
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Total Revenue
          </h3>
          <motion.div 
            className="text-3xl font-bold text-green-700"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.6 }}
          >
            ₹{displayRevenue.toFixed(2)}
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Total Products Sold
          </h3>
          <motion.div 
            className="text-3xl font-bold text-blue-600"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.6 }}
          >
            {products.reduce((sum, p) => sum + (p.unitsSold || 0), 0)}
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-600" />
            Total CO₂ Impact
          </h3>
          <motion.div 
            className="text-3xl font-bold text-eco-600 flex items-center gap-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.6 }}
          >
            {displayCO2.toFixed(2)} kg
          </motion.div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Trend Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Sales Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={selectedTimeRange === 'year' ? 0 : 'preserveStartEnd'}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  name="Revenue (₹)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#2563eb"
                  name="Units Sold"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Category Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => `${props.name} (${((Number(props.percent) ?? 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Top Performing Products
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-right py-3 px-4">Units Sold</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">CO₂ Impact</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="text-right py-3 px-4">{product.unitsSold || 0}</td>
                  <td className="text-right py-3 px-4">₹{((product.price || 0) * (product.unitsSold || 0)).toFixed(2)}</td>
                  <td className="text-right py-3 px-4">{((product.carbonFootprint || 0) * (product.unitsSold || 0)).toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
