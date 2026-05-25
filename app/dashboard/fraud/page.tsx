"use client";

import { useEffect, useState } from "react";
import { getRetailData, Transaction } from "@/lib/data";
import { detectAnomalies } from "@/lib/ml";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function FraudDetection() {
  const [anomalies, setAnomalies] = useState<Transaction[]>([]);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);

  useEffect(() => {
    const rawData = getRetailData();
    const scored = detectAnomalies(rawData);
    setTotalAnalyzed(rawData.length);
    setAnomalies(scored.filter(t => t.isAnomaly).sort((a,b) => b.sales - a.sales));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Fraud & Anomaly Detection</h1>
        <p className="text-sm text-gray-400">Isolation Forest (Z-Score approximation) detecting unusual transaction patterns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
           <p className="text-sm font-medium text-gray-400 mb-1">Transactions Analyzed</p>
           <p className="text-3xl font-semibold text-white">{totalAnalyzed.toLocaleString()}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <p className="text-sm font-medium text-red-400">Flagged Anomalies</p>
            </div>
           <p className="text-3xl font-semibold text-white">{anomalies.length}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-medium text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> 
            Suspicious Transactions List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-950/50 text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4 text-right">Value</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {anomalies.map((txn, i) => (
                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-300 font-mono text-xs">{txn.orderId}</td>
                  <td className="px-6 py-4 text-gray-400">{format(parseISO(txn.date), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 text-gray-300">{txn.customerId}</td>
                  <td className="px-6 py-4 text-gray-300">{txn.productName}</td>
                  <td className="px-6 py-4 text-white font-medium text-right">${txn.sales.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-full font-medium">
                      High Risk
                    </span>
                  </td>
                </tr>
              ))}
              {anomalies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No anomalies detected in the current dataset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
