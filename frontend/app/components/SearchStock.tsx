"use client";
import { useState } from "react";

const API = "https://financial-ai-agent-ruz1.onrender.com";

export default function SearchStock({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API}/stocks/${query.toUpperCase()}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to fetch stock data");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
      <h2 className="text-xl font-bold mb-4">🔍 Search Any Stock</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter stock ticker (e.g. AAPL, TCS.NS)"
          className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-400 disabled:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && (
        <div 
          onClick={() => onSelect(result.symbol)}
          className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-white text-lg">{result.name}</p>
              <p className="text-gray-400">{result.symbol}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-xl">₹{result.current_price}</p>
              <p className={result.change_percent >= 0 ? "text-green-400" : "text-red-400"}>
                {result.change_percent >= 0 ? "▲" : "▼"} {result.change_percent}%
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-400 mt-4">Click to view 30-day chart ↓</p>
        </div>
      )}
    </div>
  );
}
