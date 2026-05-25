"use client";

import { useEffect, useState } from "react";
import { getRetailData, Transaction } from "@/lib/data";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { DollarSign, ShoppingBag, Users, TrendingUp, Sparkles } from "lucide-react";
import { getInsight } from "@/app/actions";

export default function ExecutiveDashboard() {
  const [data, setData] = useState<Transaction[]>([]);
  const [insight, setInsight] = useState<string>("Loading AI Insights...");

  useEffect(() => {
    const rawData = getRetailData();
    setData(rawData);

    // Prepare context for AI Insight
    const totalSales = rawData.reduce((acc, t) => acc + t.sales, 0);
    const totalProfit = rawData.reduce((acc, t) => acc + t.profit, 0);
    const insightContext = `Total Revenue: $${totalSales.toFixed(0)}, Total Profit: $${totalProfit.toFixed(0)}, Total Orders: ${rawData.length}. Data ranges over the last year. Focus on general growth and profitability.`;
    
    getInsight(insightContext).then(res => setInsight(res));
  }, []);

  if (data.length === 0) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-700 rounded"></div></div></div>;

  // Calculate Metrics
  const totalRevenue = data.reduce((acc, t) => acc + t.sales, 0);
  const totalProfit = data.reduce((acc, t) => acc + t.profit, 0);
  const totalOrders = data.length;
  const uniqueCustomers = new Set(data.map(t => t.customerId)).size;
  const aov = totalRevenue / totalOrders;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  // Daily Trends
  const dailyMap = new Map<string, number>();
  data.forEach(t => {
    const d = format(parseISO(t.date), "MMM dd");
    dailyMap.set(d, (dailyMap.get(d) || 0) + t.sales);
  });
  // Take last 30 for chart
  const trendData = Array.from(dailyMap.entries()).slice(-30).map(([date, sales]) => ({ date, sales }));

  // Region Sales
  const regionMap = new Map<string, number>();
  data.forEach(t => {
    regionMap.set(t.region, (regionMap.get(t.region) || 0) + t.sales);
  });
  const regionData = Array.from(regionMap.entries()).map(([region, sales]) => ({ region, sales })).sort((a,b) => b.sales - a.sales);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Executive Overview</h1>
          <p className="text-sm text-gray-400">High-level KPIs and business performance metrics.</p>
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-4">
        <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-indigo-300 mb-1">AI Business Insight</h3>
          <p className="text-sm text-indigo-100/80">{insight}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={`$${(totalRevenue/1000).toFixed(1)}k`} icon={DollarSign} trend="+12.5%" />
        <KpiCard title="Total Profit" value={`$${(totalProfit/1000).toFixed(1)}k`} icon={TrendingUp} trend={`Margin ${profitMargin.toFixed(1)}%`} />
        <KpiCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingBag} trend="-2.1%" negative />
        <KpiCard title="Active Customers" value={uniqueCustomers.toString()} icon={Users} trend="+5.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-medium text-white mb-6">Revenue Trend (Last 30 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Sales */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-medium text-white mb-6">Sales by Region</h2>
          <div className="h-[300px] w-full flex flex-col justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="region" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={60} />
                <RechartsTooltip 
                  cursor={{fill: '#1f2937'}}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, trend, negative = false }: any) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${negative ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      </div>
    </div>
  )
}
