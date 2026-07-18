import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length === 0) {
    return Response.json({ results: [] });
  }

  const res = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) {
    return Response.json({ results: [] });
  }

  const data = await res.json();
  const results = (data.quotes || []).map((q: Record<string, unknown>) => ({
    symbol: q.symbol,
    name: q.shortname || q.longname || q.symbol,
    type: q.quoteType,
    exchange: q.exchDisp || q.exchange,
  }));

  return Response.json({ results });
}
