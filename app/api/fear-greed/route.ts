import { NextResponse } from "next/server";
import { cachedFetch, FIVE_MIN } from "@/lib/cache";

interface FearGreedData {
  value: number;
  label: string;
  timestamp: string;
}

async function fetchFearGreed(): Promise<FearGreedData> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();
    const d = json.data?.[0];
    return {
      value: parseInt(d.value, 10),
      label: d.value_classification,
      timestamp: new Date(parseInt(d.timestamp, 10) * 1000).toISOString(),
    };
  } catch {
    return { value: 50, label: "Neutral", timestamp: new Date().toISOString() };
  }
}

export async function GET() {
  const data = await cachedFetch("fear-greed", fetchFearGreed, FIVE_MIN);
  return NextResponse.json(data);
}
