from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.tools.stock_tool import get_stock_price

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

# In-memory storage (works for demo)
portfolio = {}

class AddStockRequest(BaseModel):
    symbol: str
    quantity: int
    buy_price: float

@router.post("/add")
def add_stock(req: AddStockRequest):
    symbol = req.symbol.upper()
    portfolio[symbol] = {
        "symbol": symbol,
        "quantity": req.quantity,
        "buy_price": req.buy_price
    }
    return {"message": f"{symbol} added to portfolio", "portfolio": portfolio}

@router.get("/summary")
def get_portfolio():
    result = []
    total_invested = 0
    total_current = 0

    for symbol, data in portfolio.items():
        live = get_stock_price(symbol)
        current_price = live.get("current_price", data["buy_price"])
        invested = data["buy_price"] * data["quantity"]
        current_value = current_price * data["quantity"]
        pnl = current_value - invested
        pnl_pct = (pnl / invested) * 100

        result.append({
            "symbol": symbol,
            "quantity": data["quantity"],
            "buy_price": data["buy_price"],
            "current_price": round(current_price, 2),
            "invested": round(invested, 2),
            "current_value": round(current_value, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 2)
        })

        total_invested += invested
        total_current += current_value

    return {
        "holdings": result,
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current, 2),
        "total_pnl": round(total_current - total_invested, 2),
        "total_pnl_percent": round(((total_current - total_invested) / total_invested * 100) if total_invested > 0 else 0, 2)
    }

@router.delete("/remove/{symbol}")
def remove_stock(symbol: str):
    symbol = symbol.upper()
    if symbol in portfolio:
        del portfolio[symbol]
        return {"message": f"{symbol} removed"}
    return {"message": "Symbol not found"}