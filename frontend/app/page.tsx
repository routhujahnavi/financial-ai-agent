"use client";
import { useEffect, useState } from "react";
import StockChart from "./components/StockChart";
import Portfolio from "./components/Portfolio";

const API = "https://financial-ai-agent-ruz1.onrender.com";

export default function Home() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");

  useEffect(() => {
    fetch(`${API}/stocks/indian/top`)
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setAnalyzing(true);
    setAnalysis("");
    try {
      const res = await fetch(`${API}/agent/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis("Error connecting to backend. Make sure the server is running!");
    }
    setAnalyzing(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-400">📈 Financial AI Agent</h1>
        <p className="text-gray-400 mt-2">AI-powered Indian Stock Market Research Platform</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <h2 className="text-xl font-bold mb-4">🤖 Ask AI About Any Stock</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Should I buy Reliance? Analyze TCS for me..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {analysis && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-green-400">
            <p className="text-green-400 font-bold mb-2">🤖 AI Analysis:</p>
            <p className="text-gray-200 leading-relaxed">{analysis}</p>
          </div>
        )}
        {analyzing && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-yellow-400">⏳ AI is analyzing the stock data...</p>
          </div>
        )}
      </div>

      <StockChart symbol={selectedStock} />
      <Portfolio />

      <h2 className="text-xl font-bold mt-8 mb-4">🔴 Live Top Indian Stocks</h2>
      {loading ? (
        <p className="text-gray-400">Loading live data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => {
                setQuery(`Should I buy ${stock.symbol.replace('.NS', '')}?`);
                setSelectedStock(stock.symbol);
              }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{stock.name}</p>
                  <p className="text-gray-400 text-sm">{stock.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">₹{stock.current_price}</p>
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
              <p className="text-xs text-gray-600 mt-2">Click to analyze + view chart →</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}