from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.stock_routes import router as stock_router
from backend.app.api.agent_routes import router as agent_router

app = FastAPI(
    title="Financial AI Agent",
    description="AI-powered financial research platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock_router)
app.include_router(agent_router)

@app.get("/")
def root():
    return {"message": "Financial AI Agent is running!"}

@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}