import { NextRequest, NextResponse } from "next/server";

interface AnalystData {
  symbol: string;
  name: string;
  price: number;
  targetMean: number;
  targetHigh: number;
  targetLow: number;
  targetMedian: number;
  recommendation: string;
  numberOfAnalysts: number;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  upgrades: { firm: string; toGrade: string; fromGrade: string; date: string }[];
}

async function fetchAnalystData(symbol: string): Promise<AnalystData | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=recommendationTrend,upgradeDowngradeHistory,financialData,price`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json.quoteSummary?.result?.[0];
    if (!result) return null;

    const financial = result.financialData;
    const price = result.price;
    const trend = result.recommendationTrend?.trend?.[0];
    const upgrades = (result.upgradeDowngradeHistory?.history || [])
      .slice(0, 10)
      .map((u: Record<string, unknown>) => ({
        firm: u.firm || "Unknown",
        toGrade: u.toGrade || "",
        fromGrade: u.fromGrade || "",
        date: u.epochGradeDate
          ? new Date((u.epochGradeDate as number) * 1000).toISOString().split("T")[0]
          : "",
      }));

    return {
      symbol,
      name: price?.shortName || price?.longName || symbol,
      price: price?.regularMarketPrice?.raw || 0,
      targetMean: financial?.targetMeanPrice?.raw || 0,
      targetHigh: financial?.targetHighPrice?.raw || 0,
      targetLow: financial?.targetLowPrice?.raw || 0,
      targetMedian: financial?.targetMedianPrice?.raw || 0,
      recommendation: financial?.recommendationKey || "none",
      numberOfAnalysts: financial?.numberOfAnalystOpinions?.raw || 0,
      strongBuy: trend?.strongBuy || 0,
      buy: trend?.buy || 0,
      hold: trend?.hold || 0,
      sell: trend?.sell || 0,
      strongSell: trend?.strongSell || 0,
      upgrades,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const symbols = req.nextUrl.searchParams.get("symbols");

  if (symbol) {
    const data = await fetchAnalystData(symbol);
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  if (symbols) {
    const list = symbols.split(",").slice(0, 10);
    const results = await Promise.all(list.map(fetchAnalystData));
    const data: Record<string, AnalystData> = {};
    results.forEach((r) => {
      if (r) data[r.symbol] = r;
    });
    return NextResponse.json({ analysts: data });
  }

  return NextResponse.json({ error: "Provide ?symbol= or ?symbols=" }, { status: 400 });
}
