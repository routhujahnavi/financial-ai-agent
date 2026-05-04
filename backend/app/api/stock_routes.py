from fastapi import APIRouter
from backend.app.tools.stock_tool import get_stock_price, get_stock_history, get_multiple_stocks

router = APIRouter(prefix="/stocks", tags=["Stocks"])

@router.get("/{symbol}")
def fetch_stock(symbol: str):
    """Get current price for a stock"""
    return get_stock_price(symbol)

@router.get("/{symbol}/history")
def fetch_history(symbol: str, days: int = 30):
    """Get historical data for a stock"""
    return get_stock_history(symbol, days)

@router.post("/multiple")
def fetch_multiple(symbols: list[str]):
    """Get data for multiple stocks"""
    return get_multiple_stocks(symbols)

@router.get("/indian/top")
def top_indian_stocks():
    """Get top Indian stocks"""
    symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "WIPRO", "ICICIBANK", "HINDUNILVR", "ITC"]
    return get_multiple_stocks(symbols)