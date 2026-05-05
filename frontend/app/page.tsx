
"use client";
import { useEffect, useState } from "react";
import { fetchTopStocks } from "../src/api";

export default function Home() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopStocks().then((data) => {
      setStocks(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-400">
          📈 Financial AI Agent
        </h1>
        <p className="text-gray-400 mt-2">
          AI-powered Indian Stock Market Research Platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h2 className="text-xl font-bold mb-4">🔍 Ask AI About Any Stock</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. Analyze RELIANCE for me..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400"
          />
          <button className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            Analyze
          </button>
        </div>
      </div>

      {/* Live Stock Cards */}
      <h2 className="text-xl font-bold mb-4">🔴 Live Top Indian Stocks</h2>
      {loading ? (
        <p className="text-gray-400">Loading live data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{stock.name}</p>
                  <p className="text-gray-400 text-sm">{stock.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">
                    ₹{stock.current_price}
                  </p>
                  <p className={stock.change_percent >= 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                    {stock.change_percent >= 0 ? "▲" : "▼"} {stock.change_percent}%
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
                <span>PE: {stock.pe_ratio}</span>
                <span>52W H: ₹{stock["52_week_high"]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
