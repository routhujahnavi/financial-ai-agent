"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function StockChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/stocks/${symbol}/history`)
      .then(res => res.json())
      .then(d => {
        setData(d.history || []);
        setLoading(false);
      });
  }, [symbol]);

  if (loading) return <p className="text-gray-400">Loading chart...</p>;
  if (!data.length) return <p className="text-gray-400">No chart data</p>;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6">
      <h3 className="text-lg font-bold mb-4 text-white">📊 {symbol} — 30 Day Price Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "8px" }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#4ade80" }}
          />
          <Line type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}