
const BASE_URL = "http://127.0.0.1:8000";

export async function fetchStock(symbol: string) {
  const res = await fetch(`${BASE_URL}/stocks/${symbol}`);
  const data = await res.json();
  return data;
}

export async function fetchTopStocks() {
  const res = await fetch(`${BASE_URL}/stocks/indian/top`);
  const data = await res.json();
  return data;
}

export async function fetchStockHistory(symbol: string, days: number = 30) {
  const res = await fetch(`${BASE_URL}/stocks/${symbol}/history`);
  const data = await res.json();
  return data;
}
