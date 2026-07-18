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
import { TrendingUp, TrendingDown, Minus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface QuoteData {
  price: number;
  change: number;
  history: { date: string; value: number }[];
}

interface MarketData {
  sp500: QuoteData | null;
  btc: QuoteData | null;
  vix: QuoteData | null;
  sectors: { name: string; return: number }[];
}

const TrendIcon = ({ change }: { change: number }) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

function MetricCard({ label, value, change }: { label: string; value: string; change: number }) {
  return (
    <DragCard title={label}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <TrendIcon change={change} />
        <span className={`text-sm ${change > 0 ? "text-emerald-500" : change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
          {change > 0 ? "+" : ""}{change}%
        </span>
      </div>
    </DragCard>
  );
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/market?section=overview");
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch {
      setError("Failed to load market data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const gridItems: GridItem[] = useMemo(() => {
    if (!data) return [];
    return [
      {
        id: "sp500-metric",
        defaultW: 4, defaultH: 2, minW: 3, minH: 2,
        content: (
          <MetricCard label="S&P 500" value={data.sp500?.price?.toLocaleString() || "—"} change={data.sp500?.change || 0} />
        ),
      },
      {
        id: "btc-metric",
        defaultW: 4, defaultH: 2, minW: 3, minH: 2,
        content: (
          <MetricCard label="BTC/USD" value={data.btc?.price ? `$${data.btc.price.toLocaleString()}` : "—"} change={data.btc?.change || 0} />
        ),
      },
      {
        id: "vix-metric",
        defaultW: 4, defaultH: 2, minW: 3, minH: 2,
        content: (
          <MetricCard label="VIX" value={data.vix?.price?.toFixed(1) || "—"} change={data.vix?.change || 0} />
        ),
      },
      {
        id: "sp500-chart",
        defaultW: 6, defaultH: 5, minW: 4, minH: 4,
        content: (
          <DragCard title="S&P 500" description={t("30dayPrice")}>
            <TradingViewWidget symbol="SPX" autosize />
          </DragCard>
        ),
      },
      {
        id: "btc-chart",
        defaultW: 6, defaultH: 5, minW: 4, minH: 4,
        content: (
          <DragCard title="Bitcoin" description={t("30dayPrice")}>
            <TradingViewWidget symbol="BTCUSD" autosize />
          </DragCard>
        ),
      },
    ];
  }, [data, t]);

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("loadingMarket")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("refresh")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("marketOverview")}</h1>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> {t("refresh")}
        </Button>
      </div>
      <DraggableGrid items={gridItems} storageKey="dashboard-overview" />
    </div>
  );
}
