# 📈 Financial AI Agent

> An AI-powered Indian Stock Market Research Platform built with FastAPI, Next.js, and Groq LLM

## 🌐 Live Demo
🚀 **[https://financial-ai-agent-roan.vercel.app](https://financial-ai-agent-roan.vercel.app)**

---

## 👥 Team
| Name | Role | Responsibilities |
|------|------|-----------------|
| Routhu Jahnavi | Backend Developer | FastAPI, AI Agent, Stock Data, Deployment |
| Cherishma | Frontend Developer | Next.js UI, Charts, Portfolio UI, Deployment |

---

## ✨ Features
- 🤖 **AI Stock Analysis** — Ask any question about Indian stocks and get real AI-powered analysis
- 📊 **30-Day Price Charts** — Interactive line charts with hover tooltips for any stock
- 💼 **Portfolio Tracker** — Add stocks, track live P&L (Profit & Loss) in real time
- 🔴 **Live Stock Data** — Real-time prices, volume, PE ratio, 52-week high for top Indian stocks
- ⚡ **Instant Analysis** — Powered by Groq's llama-3.3-70b model for fast responses

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Stock price charts |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | Python web framework |
| Python 3.13 | Backend language |
| yfinance | Live stock data from Yahoo Finance |
| Groq API | AI LLM (llama-3.3-70b) |
| Uvicorn | ASGI server |
| python-dotenv | Environment variable management |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| GitHub | Version control |

---

## 📁 Project Structure
\```
financial-ai-agent/
├── backend/app/
│   ├── main.py
│   ├── api/
│   │   ├── stock_routes.py
│   │   ├── agent_routes.py
│   │   └── portfolio_routes.py
│   ├── agents/stock_agent.py
│   └── tools/stock_tool.py
├── frontend/app/
│   ├── page.tsx
│   └── components/
│       ├── StockChart.tsx
│       └── Portfolio.tsx
├── requirements.txt
├── render.yaml
└── README.md
\```

## 🚀 API Endpoints

### Stock Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stocks/{symbol}` | Get live price for any stock |
| GET | `/stocks/indian/top` | Get top 8 Indian stocks |
| GET | `/stocks/{symbol}/history` | Get 30-day price history |

### AI Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agent/analyze` | AI analysis for any stock query |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/portfolio/add` | Add stock to portfolio |
| GET | `/portfolio/summary` | Get portfolio with live P&L |
| DELETE | `/portfolio/remove/{symbol}` | Remove stock from portfolio |

---

## ⚙️ Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/routhujahnavi/financial-ai-agent.git
cd financial-ai-agent
```

### 2. Setup Backend
```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 3. Create .env file
```bash
# Mac/Linux
echo "GROQ_API_KEY=your_groq_key_here" > .env

# Windows
python -c "open('.env', 'w', encoding='utf-8').write('GROQ_API_KEY=your_groq_key_here\n')"
```

### 4. Start Backend
```bash
uvicorn backend.app.main:app --reload
# Running at http://127.0.0.1:8000
```

### 5. Setup and Start Frontend
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:3000
```

---

## 🔑 Environment Variables
| Variable | Description | Where to get |
|----------|-------------|--------------|
| `GROQ_API_KEY` | Groq LLM API key | [console.groq.com](https://console.groq.com) |

---

## 📸 Screenshots
> Dashboard with live stocks, AI analysis, 30-day chart and portfolio tracker

---

## 🙏 Acknowledgements
- [Groq](https://groq.com) — for the fast LLM API
- [yfinance](https://github.com/ranaroussi/yfinance) — for free stock data
- [Vercel](https://vercel.com) — for free frontend hosting
- [Render](https://render.com) — for free backend hosting
