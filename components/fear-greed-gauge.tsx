"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FGData {
  value: number;
  label: string;
}

function getColor(value: number): string {
  if (value <= 25) return "#ef4444";
  if (value <= 45) return "#f97316";
  if (value <= 55) return "#eab308";
  if (value <= 75) return "#84cc16";
  return "#22c55e";
}

export function FearGreedGauge() {
  const [data, setData] = useState<FGData | null>(null);

  useEffect(() => {
    fetch("/api/fear-greed")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const color = getColor(data.value);
  const angle = (data.value / 100) * 180 - 90;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Fear & Greed Index</CardTitle>
        <CardDescription>Crypto market sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 200 120" className="w-full max-w-[220px]">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Gradient segments */}
            <path d="M 20 100 A 80 80 0 0 1 56 40" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
            <path d="M 56 40 A 80 80 0 0 1 100 20" fill="none" stroke="#f97316" strokeWidth="16" />
            <path d="M 100 20 A 80 80 0 0 1 144 40" fill="none" stroke="#eab308" strokeWidth="16" />
            <path d="M 144 40 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" />
            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill={color} />
            {/* Labels */}
            <text x="20" y="118" fontSize="10" fill="currentColor" className="fill-muted-foreground">Fear</text>
            <text x="160" y="118" fontSize="10" fill="currentColor" className="fill-muted-foreground">Greed</text>
          </svg>
          <div className="text-center mt-2">
            <span className="text-3xl font-bold" style={{ color }}>{data.value}</span>
            <p className="text-sm font-medium" style={{ color }}>{data.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
