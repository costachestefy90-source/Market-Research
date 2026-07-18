# Market Research

A full-stack market research platform with live data, AI-powered analysis, and interactive TradingView charts.

## Features

- **Stock Search** — search any stock, ETF, or index with real-time TradingView charts and favorites
- **Wall Street Ratings** — analyst consensus, price targets, upgrade/downgrade history for any stock
- **Market News** — real-time news feed with AI impact analysis and discussion per article
- **AI Q&A** — ask any market question, get detailed analyst-grade responses with PDF export
- **Crypto Dashboard** — live BTC/ETH/SOL charts, CoinGecko prices, DeFi TVL
- **Market Overview** — S&P 500, BTC, VIX metrics with Fear & Greed gauge
- **Watchlist Alerts** — set price target alerts with browser notifications
- **Research Articles** — original analysis on breadth, on-chain data, yield curve, sector rotation
- **Draggable Layouts** — resize and rearrange dashboard widgets, positions saved locally
- **EN/RO Language Support** — full bilingual interface
- **Dark/Light Theme**

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Turbopack)
- **TradingView Widgets** (real-time embedded charts)
- **Tailwind CSS v4** + **shadcn/ui**
- **Groq API** (Llama 3.3 70B for AI Q&A)
- **react-grid-layout** (draggable/resizable dashboards)
- **Yahoo Finance API** (quotes, search, analyst data)
- **CoinGecko + DeFi Llama** (crypto data)
- **Alternative.me** (Fear & Greed Index)

## Setup

```bash
git clone https://github.com/costachestefy90-source/Market.git
cd Market
npm install
```

Create `.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` environment variable
4. Deploy

## Data Sources

All data comes from free, public APIs:

| Source | Data |
|--------|------|
| Yahoo Finance | Stock quotes, search, analyst ratings |
| TradingView | Real-time interactive charts (embedded widgets) |
| CoinGecko | Crypto prices, market caps |
| DeFi Llama | DeFi TVL data |
| Alternative.me | Crypto Fear & Greed Index |
| Google News RSS | Market news feed |
| Groq (Llama 3.3) | AI-powered analysis |

## License

MIT
