"use client";

import { useEffect, useState } from "react";
import { getRetailData, Transaction } from "@/lib/data";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Filter } from "lucide-react";

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function SalesAnalytics() {
  const [data, setData] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setData(getRetailData());
  }, []);

  if (data.length === 0) return <div>Loading...</div>;

  const categories = ["All", ...Array.from(new Set(data.map(t => t.category)))];
  const filteredData = selectedCategory === "All" ? data : data.filter(t => t.category === selectedCategory);

  // Top Products
  const productMap = new Map<string, number>();
  filteredData.forEach(t => {
    productMap.set(t.productName, (productMap.get(t.productName) || 0) + t.sales);
  });
  const topProducts = Array.from(productMap.entries())
                           .map(([name, sales]) => ({ name, sales }))
                           .sort((a,b) => b.sales - a.sales)
                           .slice(0, 10);

  // Category Distribution (only if "All" is selected)
  const categoryMap = new Map<string, number>();
  data.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.sales);
  });
  const categoryPieData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Sales Analytics</h1>
          <p className="text-sm text-gray-400">Deep dive into product and category performance.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 object-contain">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Bar Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-medium text-white mb-6">Top Products by Revenue {selectedCategory !== "All" && `(${selectedCategory})`}</h2>
          <div className="h-[400px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: '#1f2937'}}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-medium text-white mb-6">Revenue by Category</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
