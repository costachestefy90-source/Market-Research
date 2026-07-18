"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { TradingViewWidget } from "@/components/charts/tradingview-widget";
import { DragCard } from "@/components/drag-card";
import { DraggableGrid, type GridItem } from "@/components/draggable-grid";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  market_cap: number;
}

interface CryptoData {
  coins: CoinData[];
  btcChart: { date: string; value: number }[];
  ethChart: { date: string; value: number }[];
  defiTvl: { date: string; tvl: number }[];
}

export default function CryptoPage() {
  const [data, setData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/market?section=crypto");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const gridItems: GridItem[] = useMemo(() => {
    if (!data) return [];

    const coinCards: GridItem[] = (data.coins || []).map((c) => ({
      id: `coin-${c.symbol}`,
      defaultW: 4, defaultH: 2, minW: 3, minH: 2,
      content: (
        <DragCard title={c.symbol} headerExtra={
          <Badge variant={c.change_24h >= 0 ? "default" : "destructive"} className="text-xs">
            {c.change_24h >= 0 ? "+" : ""}{c.change_24h}%
          </Badge>
        }>
          <div>
            <span className="text-2xl font-bold">${c.price?.toLocaleString()}</span>
            <p className="text-xs text-muted-foreground mt-1">MCap: ${(c.market_cap / 1e9).toFixed(0)}B</p>
          </div>
        </DragCard>
      ),
    }));

    return [
      ...coinCards,
      {
        id: "btc-chart",
        defaultW: 6, defaultH: 5, minW: 4, minH: 4,
        content: (
          <DragCard title="BTC/USD" description="Real-time price">
            <TradingViewWidget symbol="BTCUSD" autosize />
          </DragCard>
        ),
      },
      {
        id: "eth-chart",
        defaultW: 6, defaultH: 5, minW: 4, minH: 4,
        content: (
          <DragCard title="ETH/USD" description="Real-time price">
            <TradingViewWidget symbol="ETHUSD" autosize />
          </DragCard>
        ),
      },
      {
        id: "sol-chart",
        defaultW: 12, defaultH: 5, minW: 4, minH: 4,
        content: (
          <DragCard title="SOL/USD" description="Real-time price">
            <TradingViewWidget symbol="SOLUSD" autosize />
          </DragCard>
        ),
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading crypto data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Crypto</h1>
          <p className="text-muted-foreground text-sm">Live prices and charts</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
        </Button>
      </div>
      <DraggableGrid items={gridItems} storageKey="dashboard-crypto" />
    </div>
  );
}
