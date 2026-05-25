"use client";

import { useEffect, useState } from "react";
import { getRetailData } from "@/lib/data";
import { analyzeInventory, InventoryItem } from "@/lib/ml";
import { Package, AlertCircle, ArrowDown, CheckCircle2 } from "lucide-react";

export default function InventoryOptimization() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const rawData = getRetailData();
    const inv = analyzeInventory(rawData);
    setInventory(inv);
  }, []);

  if (inventory.length === 0) return <div>Loading Inventory Data...</div>;

  const outOfStock = inventory.filter(i => i.status === "Out of Stock").length;
  const lowStock = inventory.filter(i => i.status === "Low Stock").length;
  const inStock = inventory.filter(i => i.status === "In Stock").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Inventory Optimization</h1>
        <p className="text-sm text-gray-400">AI-driven restock alerts based on 30-day velocity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 border-t-2 border-t-red-500">
          <p className="text-sm font-medium text-gray-400 mb-1">Out of Stock</p>
          <p className="text-3xl font-semibold text-white">{outOfStock}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 border-t-2 border-t-amber-500">
           <p className="text-sm font-medium text-gray-400 mb-1">Low Stock</p>
           <p className="text-3xl font-semibold text-white">{lowStock}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 border-t-2 border-t-emerald-500">
           <p className="text-sm font-medium text-gray-400 mb-1">Healthy Stock</p>
           <p className="text-3xl font-semibold text-white">{inStock}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-base font-medium text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Inventory Status Report
          </h2>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-950 text-gray-400 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Current Stock</th>
                <th className="px-6 py-4 text-center">30d Demand</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {inventory.map((item, i) => (
                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-200 font-medium">{item.productName}</td>
                  <td className="px-6 py-4 text-gray-400">{item.category}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono ${item.currentStock === 0 ? "text-red-400" : "text-gray-300"}`}>{item.currentStock}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400 font-mono">{item.monthlyVelocity}</td>
                  <td className="px-6 py-4">
                    {item.status === "Out of Stock" && (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5"/> Out of Stock</span>
                    )}
                    {item.status === "Low Stock" && (
                      <span className="flex items-center gap-1.5 text-amber-500 text-xs font-medium"><ArrowDown className="w-3.5 h-3.5"/> Low Stock</span>
                    )}
                    {item.status === "In Stock" && (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
