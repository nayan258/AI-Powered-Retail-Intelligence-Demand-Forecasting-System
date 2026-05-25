"use client";

import { useEffect, useState } from "react";
import { getRetailData } from "@/lib/data";
import { performRFM, CustomerSegment } from "@/lib/ml";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend, Cell
} from "recharts";
import { Users2, Award, Clock4, UserPlus } from "lucide-react";

const CLUSTER_COLORS = {
  "High-Value": "#ec4899", // pink
  "Loyal": "#6366f1", // indigo
  "At-Risk": "#f59e0b", // amber
  "New": "#10b981", // emerald
};

export default function CustomerSegmentation() {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);

  useEffect(() => {
    const rawData = getRetailData();
    const seg = performRFM(rawData);
    setSegments(seg);
  }, []);

  if (segments.length === 0) return <div>Loading Segments...</div>;

  // Counts
  const counts = {
    "High-Value": segments.filter(s => s.cluster === "High-Value").length,
    "Loyal": segments.filter(s => s.cluster === "Loyal").length,
    "At-Risk": segments.filter(s => s.cluster === "At-Risk").length,
    "New": segments.filter(s => s.cluster === "New").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Customer Segmentation</h1>
        <p className="text-sm text-gray-400">AI-driven RFM analysis clustering customers by behavioral patterns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SegmentCard title="High-Value" count={counts["High-Value"]} color="text-pink-500" bg="bg-pink-500/10" border="border-pink-500/20" icon={Award} />
        <SegmentCard title="Loyal Customers" count={counts["Loyal"]} color="text-indigo-500" bg="bg-indigo-500/10" border="border-indigo-500/20" icon={Users2} />
        <SegmentCard title="At-Risk Customers" count={counts["At-Risk"]} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" icon={Clock4} />
        <SegmentCard title="New Customers" count={counts["New"]} color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/20" icon={UserPlus} />
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-medium text-white mb-6">Cluster Distribution (Recency vs Monetary)</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" dataKey="recency" name="Recency (Days)" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="number" dataKey="monetary" name="Spend ($)" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <ZAxis type="number" dataKey="frequency" range={[50, 400]} name="Orders" />
              <Tooltip 
                cursor={{strokeDasharray: '3 3'}}
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                formatter={(value: any, name: any) => name === "Spend ($)" ? `$${value}` : value}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle"/>
              {Object.keys(CLUSTER_COLORS).map(clusterName => (
                <Scatter 
                  key={clusterName} 
                  name={clusterName} 
                  data={segments.filter(s => s.cluster === clusterName)} 
                  fill={CLUSTER_COLORS[clusterName as keyof typeof CLUSTER_COLORS]}
                >
                   {segments.filter(s => s.cluster === clusterName).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[clusterName as keyof typeof CLUSTER_COLORS]} fillOpacity={0.7} />
                  ))}
                </Scatter>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ title, count, color, bg, border, icon: Icon }: any) {
  return (
    <div className={`border rounded-2xl p-5 ${bg} ${border}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="w-10 h-10 rounded-xl bg-gray-900/50 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div>
        <h3 className={`text-sm font-medium ${color}`}>{title}</h3>
        <p className="text-3xl font-semibold text-white mt-1">{count}</p>
      </div>
    </div>
  )
}
