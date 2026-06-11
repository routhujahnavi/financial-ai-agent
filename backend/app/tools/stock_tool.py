import yfinance as yf
from datetime import datetime
import time
import requests

# Simple memory cache
PRICE_CACHE = {}
HISTORY_CACHE = {}
CACHE_TTL = 300  # 5 minutes cache

def clean(val):
    """Convert numpy types to plain Python types"""
    try:
        if str(val) == 'nan': return 0
        return float(val)
    except:
        return val

def get_stock_price(symbol: str) -> dict:
    """Get current stock price and basic info"""
    try:
        if "." not in symbol:
            symbol = symbol + ".NS"
            
        current_time = time.time()
        if symbol in PRICE_CACHE and current_time - PRICE_CACHE[symbol]['time'] < CACHE_TTL:
            return PRICE_CACHE[symbol]['data']
        
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1d")
        
        if hist.empty:
            return {"error": f"No data found for {symbol}"}
        
        current_price = clean(hist['Close'].iloc[-1])
        open_price = clean(hist['Open'].iloc[-1])
        change = round(current_price - open_price, 2)
        change_pct = round((change / open_price) * 100, 2) if open_price else 0
        
        result = {
            "symbol": symbol,
            "name": info.get("longName", symbol),
            "current_price": round(current_price, 2),
            "open_price": round(open_price, 2),
            "change": change,
            "change_percent": change_pct,
            "volume": int(hist['Volume'].iloc[-1]),
            "market_cap": int(info.get("marketCap", 0)),
            "pe_ratio": clean(info.get("trailingPE", 0)),
            "52_week_high": clean(info.get("fiftyTwoWeekHigh", 0)),
            "52_week_low": clean(info.get("fiftyTwoWeekLow", 0)),
            "timestamp": datetime.now().isoformat()
        }
        
        PRICE_CACHE[symbol] = {'time': current_time, 'data': result}
        return result
    except Exception as e:
        return {"error": str(e)}


def get_stock_history(symbol: str, days: int = 30) -> dict:
    """Get historical stock data"""
    try:
        if "." not in symbol:
            symbol = symbol + ".NS"
            
        cache_key = f"{symbol}_{days}"
        current_time = time.time()
        if cache_key in HISTORY_CACHE and current_time - HISTORY_CACHE[cache_key]['time'] < CACHE_TTL:
            return HISTORY_CACHE[cache_key]['data']
        
        stock = yf.Ticker(symbol)
        hist = stock.history(period=f"{days}d")
        
        if hist.empty:
            return {"error": f"No history found for {symbol}"}
        
        history = []
        for date, row in hist.iterrows():
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row['Open']), 2),
                "high": round(float(row['High']), 2),
                "low": round(float(row['Low']), 2),
                "close": round(float(row['Close']), 2),
                "volume": int(row['Volume'])
            })
        
        result = {
            "symbol": symbol,
            "days": days,
            "history": history
        }
        
        HISTORY_CACHE[cache_key] = {'time': current_time, 'data': result}
        return result
    except Exception as e:
        return {"error": str(e)}


def get_multiple_stocks(symbols: list) -> list:
    """Get data for multiple stocks at once"""
    results = []
    for symbol in symbols:
        data = get_stock_price(symbol)
        results.append(data)
        
        # Add a delay between requests to avoid rate limits from Yahoo Finance
        time.sleep(1)
        
    return results