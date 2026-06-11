"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const API = "https://financial-ai-agent-ruz1.onrender.com";

export default function Portfolio() {
  const { user, isLoaded } = useUser();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = () => {
    if (!user) return;
    fetch(`${API}/portfolio/summary?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(() => setPortfolio(null));
  };

  useEffect(() => { 
    if (isLoaded && user) {
      fetchPortfolio(); 
    }
  }, [isLoaded, user]);

  const handleAdd = async () => {
    if (!symbol || !quantity || !buyPrice || !user) return;
    setLoading(true);
    await fetch(`${API}/portfolio/add?user_id=${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        buy_price: parseFloat(buyPrice)
      })
    });
    setSymbol(""); setQuantity(""); setBuyPrice("");
    fetchPortfolio();
    setLoading(false);
  };

  const handleRemove = async (sym: string) => {
    if (!user) return;
    await fetch(`${API}/portfolio/remove/${sym}?user_id=${user.id}`, { method: "DELETE" });
    fetchPortfolio();
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6">
      <h2 className="text-xl font-bold mb-4">💼 My Portfolio</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input value={symbol} onChange={e => setSymbol(e.target.value)}
          placeholder="Symbol (e.g. RELIANCE)"
          className="bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400 flex-1" />
        <input value={quantity} onChange={e => setQuantity(e.target.value)}
          placeholder="Qty" type="number"
          className="bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400 w-24" />
        <input value={buyPrice} onChange={e => setBuyPrice(e.target.value)}
          placeholder="Buy Price" type="number"
          className="bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-green-400 w-32" />
        <button onClick={handleAdd} disabled={loading}
          className="bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black font-bold px-5 py-2 rounded-lg transition-colors">
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>

      {portfolio && portfolio.holdings && portfolio.holdings.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-white font-bold text-lg">₹{portfolio.total_invested}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Current Value</p>
              <p className="text-white font-bold text-lg">₹{portfolio.total_current_value}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Profit / Loss</p>
              <p className={`font-bold text-lg ${portfolio.total_pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                {portfolio.total_pnl >= 0 ? "▲" : "▼"} ₹{Math.abs(portfolio.total_pnl)} ({portfolio.total_pnl_percent}%)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {portfolio.holdings.map((h: any) => (
              <div key={h.symbol} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{h.symbol}</p>
                  <p className="text-gray-400 text-sm">{h.quantity} shares @ ₹{h.buy_price}</p>
                </div>
                <div className="text-center">
                  <p className="text-white">₹{h.current_price}</p>
                  <p className="text-gray-400 text-xs">Current</p>
                </div>
                <div className="text-right">
                  <p className={h.pnl >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {h.pnl >= 0 ? "▲" : "▼"} ₹{Math.abs(h.pnl)}
                  </p>
                  <p className={h.pnl >= 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                    {h.pnl_percent}%
                  </p>
                </div>
                <button onClick={() => handleRemove(h.symbol)}
                  className="text-red-400 hover:text-red-300 text-sm ml-4">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-4">No stocks in portfolio yet. Add one above!</p>
      )}
    </div>
  );
}