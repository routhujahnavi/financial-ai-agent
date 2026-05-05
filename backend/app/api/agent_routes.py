from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.agents.stock_agent import analyze_stock

router = APIRouter(prefix="/agent", tags=["AI Agent"])

class QueryRequest(BaseModel):
    query: str

@router.post("/analyze")
def analyze(request: QueryRequest):
    result = analyze_stock(request.query)
    return {"query": request.query, "analysis": result}