import { NextRequest } from "next/server";

const YAHOO_QUOTES = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchQuote(symbol: string) {
  const res = await fetch(
    `${YAHOO_QUOTES}${symbol}?interval=1d&range=1mo`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) return null;

  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  const meta = result.meta;

  const history = timestamps.map((t: number, i: number) => ({
    date: new Date(t * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: closes[i] ? Math.round(closes[i] * 100) / 100 : null,
  })).filter((d: { value: number | null }) => d.value !== null);

  const price = meta?.regularMarketPrice;
  const prevClose = meta?.chartPreviousClose;
  const change = price && prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

  return { price, change: Math.round(change * 100) / 100, history };
}

async function fetchSectorPerformance() {
  const sectors: Record<string, string> = {
    Tech: "XLK", Health: "XLV", Finance: "XLF",
    Energy: "XLE", Consumer: "XLY", Industrial: "XLI",
    Utilities: "XLU", Materials: "XLB",
  };

  const results = await Promise.all(
    Object.entries(sectors).map(async ([name, ticker]) => {
      const res = await fetch(
        `${YAHOO_QUOTES}${ticker}?interval=1d&range=ytd`,
        { next: { revalidate: 0 } }
      );
      if (!res.ok) return { name, return: 0 };
      const json = await res.json();
      const closes = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
      if (!closes || closes.length < 2) return { name, return: 0 };
      const first = closes.find((c: number | null) => c !== null);
      const last = closes[closes.length - 1];
      const ret = first && last ? ((last - first) / first) * 100 : 0;
      return { name, return: Math.round(ret * 10) / 10 };
    })
  );

  return results.sort((a, b) => b.return - a.return);
}

async function fetchCrypto() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc",
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((c: Record<string, unknown>) => ({
    symbol: (c.symbol as string).toUpperCase(),
    name: c.name,
    price: c.current_price,
    change_24h: Math.round((c.price_change_percentage_24h as number || 0) * 100) / 100,
    market_cap: c.market_cap,
  }));
}

async function fetchCryptoChart(coinId: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.prices || []).map((p: [number, number]) => ({
    date: new Date(p[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Math.round(p[1] * 100) / 100,
  }));
}

async function fetchDefiTvl() {
  const res = await fetch("https://api.llama.fi/v2/historicalChainTvl", {
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.slice(-90).map((d: { date: number; tvl: number }) => ({
    date: new Date(d.date * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tvl: Math.round(d.tvl / 1e9 * 100) / 100,
  }));
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section") || "overview";

  try {
    if (section === "overview") {
      const [sp500, btc, vix, sectors] = await Promise.all([
        fetchQuote("^GSPC"),
        fetchQuote("BTC-USD"),
        fetchQuote("^VIX"),
        fetchSectorPerformance(),
      ]);
      return Response.json({ sp500, btc, vix, sectors });
    }

    if (section === "equities") {
      const [sp500, nasdaq, russell, sectors] = await Promise.all([
        fetchQuote("^GSPC"),
        fetchQuote("^IXIC"),
        fetchQuote("^RUT"),
        fetchSectorPerformance(),
      ]);
      return Response.json({ sp500, nasdaq, russell, sectors });
    }

    if (section === "crypto") {
      const [coins, btcChart, ethChart, defiTvl] = await Promise.all([
        fetchCrypto(),
        fetchCryptoChart("bitcoin"),
        fetchCryptoChart("ethereum"),
        fetchDefiTvl(),
      ]);
      return Response.json({ coins, btcChart, ethChart, defiTvl });
    }

    if (section === "macro") {
      const [treasury10, treasury2, sp500] = await Promise.all([
        fetchQuote("^TNX"),
        fetchQuote("2YY=F"),
        fetchQuote("^GSPC"),
      ]);
      return Response.json({ treasury10, treasury2, sp500 });
    }

    return Response.json({ error: "Unknown section" }, { status: 400 });
  } catch (e) {
    return Response.json(
      { error: "Failed to fetch market data", detail: String(e) },
      { status: 500 }
    );
  }
}
