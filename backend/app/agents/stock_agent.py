import os
from dotenv import load_dotenv
from groq import Groq
from backend.app.tools.stock_tool import get_stock_price

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_stock(query: str) -> str:
    """AI agent that analyzes stocks based on user query"""
    
    words = query.upper().split()
    symbol = None
    indian_stocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "WIPRO",
                     "ICICIBANK", "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL"]
    
    for word in words:
        if word in indian_stocks:
            symbol = word
            break
    
    stock_data = None
    if symbol:
        stock_data = get_stock_price(symbol)
    
    if stock_data and "error" not in stock_data:
        prompt = f"""You are an expert Indian stock market analyst.
The user asked: "{query}"

Here is the REAL LIVE data for {stock_data['name']}:
- Current Price: ₹{stock_data['current_price']}
- Change Today: {stock_data['change_percent']}%
- PE Ratio: {stock_data['pe_ratio']}
- 52 Week High: ₹{stock_data['52_week_high']}
- 52 Week Low: ₹{stock_data['52_week_low']}
- Volume: {stock_data['volume']}

Give a clear analysis in 4-5 sentences covering:
1. Current trend (bullish/bearish)
2. Key insight from the data
3. Buy/Hold/Sell recommendation with reason
Keep it simple for a beginner investor."""
    else:
        prompt = f"""You are an expert Indian stock market analyst.
The user asked: "{query}"
Answer helpfully in 3-4 sentences as a stock market expert."""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content