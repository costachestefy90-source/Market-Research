# Market Research

A market research platform with live data, real-time charts, AI analysis, and Wall Street ratings.

**Live site: [market-f1b17ll97-steff3.vercel.app](market-steff3.vercel.app
)**

---

## What It Does

| Page | What you get |
|------|-------------|
| **Stocks** | Search any stock/ETF/index, see live TradingView charts, save favorites |
| **Wall Street** | Analyst ratings (buy/sell/hold), price targets, recent upgrades/downgrades, AI market thoughts |
| **News** | Real-time market news with AI-powered impact analysis and chat discussion |
| **Ask** | Ask any market question, get a detailed response, download as PDF |
| **Dashboard** | S&P 500, BTC, VIX overview with Fear & Greed gauge |
| **Crypto** | Live BTC/ETH/SOL charts and prices |
| **Alerts** | Set price alerts on any stock, get browser notifications when hit |
| **Research** | 5 original analysis articles (breadth, on-chain, yield curve, sector rotation, prediction markets) |

**Other features:** drag & resize any chart/widget, dark/light theme, English/Romanian language toggle.

---

## Use It

### Just visit the website

Go to **[the live site](https://market-f1b17ll97-steff3.vercel.app/)** — everything works, no setup needed.

### Run it yourself

1. **Clone and install**
   ```bash
   git clone https://github.com/costachestefy90-source/Market.git
   cd Market
   npm install
   ```

2. **Add your AI key** (optional — only needed for AI Q&A, news analysis, and market thoughts)

   Create a file called `.env.local` in the root folder:
   ```
   GROQ_API_KEY=your_key_here
   ```
   Get a free key at [console.groq.com](https://console.groq.com) (takes 30 seconds).

3. **Start**
   ```bash
   npm run dev
   ```
   Open [localhost:3000](http://localhost:3000).

> **Note:** Stock search, charts, Wall Street ratings, crypto data, news feed, and alerts all work without an API key. The key is only needed for AI-powered features.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Charts | TradingView embedded widgets (real-time) |
| AI | Groq API with Llama 3.3 70B |
| Layouts | react-grid-layout (drag & resize) |

## Data Sources

All free, no paid APIs:

| Source | What it provides |
|--------|-----------------|
| **Yahoo Finance** | Stock quotes, search, analyst ratings & price targets |
| **TradingView** | Real-time interactive charts (free embedded widgets) |
| **CoinGecko** | Crypto prices and market caps |
| **DeFi Llama** | DeFi total value locked |
| **Alternative.me** | Crypto Fear & Greed Index |
| **Google News RSS** | Market news feed |
| **Groq** | AI-powered analysis (free tier) |

---

## Deploy Your Own

1. Fork this repo
2. Go to [vercel.com](https://vercel.com) and import it
3. Add `GROQ_API_KEY` in Settings > Environment Variables
4. Deploy — you'll get a live URL in ~60 seconds

---

## License

MIT 
