import { NextRequest } from "next/server";
import { cachedFetch, ONE_MIN } from "@/lib/cache";

const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchFullQuote(symbol: string) {
  const res = await fetch(
    `${YAHOO_CHART}${encodeURIComponent(symbol)}?interval=1d&range=1mo&includePrePost=false`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return null;

  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) return null;

  const meta = result.meta;
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const closes = quote.close || [];
  const highs = quote.high || [];
  const lows = quote.low || [];
  const opens = quote.open || [];
  const volumes = quote.volume || [];

  const history = timestamps.map((t: number, i: number) => ({
    date: new Date(t * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    close: closes[i] ? Math.round(closes[i] * 100) / 100 : null,
    high: highs[i] ? Math.round(highs[i] * 100) / 100 : null,
    low: lows[i] ? Math.round(lows[i] * 100) / 100 : null,
    open: opens[i] ? Math.round(opens[i] * 100) / 100 : null,
    volume: volumes[i] || 0,
  })).filter((d: { close: number | null }) => d.close !== null);

  const price = meta?.regularMarketPrice;
  const prevClose = meta?.chartPreviousClose;
  const change = price && prevClose ? Math.round(((price - prevClose) / prevClose) * 10000) / 100 : 0;

  const latestHigh = history.length > 0 ? history[history.length - 1].high : null;
  const latestLow = history.length > 0 ? history[history.length - 1].low : null;
  const latestOpen = history.length > 0 ? history[history.length - 1].open : null;
  const latestVolume = history.length > 0 ? history[history.length - 1].volume : 0;

  return {
    symbol: meta?.symbol || symbol,
    name: meta?.longName || meta?.shortName || symbol,
    price,
    change,
    prevClose,
    open: latestOpen,
    high: latestHigh,
    low: latestLow,
    volume: latestVolume,
    currency: meta?.currency || "USD",
    exchange: meta?.exchangeName || "",
    history,
  };
}

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) {
    return Response.json({ error: "symbols param required" }, { status: 400 });
  }

  const list = symbols.split(",").slice(0, 20);
  const results = await Promise.all(
    list.map((s) => cachedFetch(`quote-${s}`, () => fetchFullQuote(s), ONE_MIN))
  );

  const quotes: Record<string, unknown> = {};
  list.forEach((s, i) => {
    if (results[i]) quotes[s] = results[i];
  });

  return Response.json({ quotes });
}
