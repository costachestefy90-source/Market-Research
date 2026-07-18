"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradingViewWidget } from "@/components/charts/tradingview-widget";
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Send,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

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

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

const TOP_PICKS = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "JPM"];

function RatingBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-medium">{value}</span>
    </div>
  );
}

function ConsensusLabel({ rec }: { rec: string }) {
  const map: Record<string, { label: string; color: string }> = {
    strong_buy: { label: "Strong Buy", color: "bg-emerald-500 text-white" },
    buy: { label: "Buy", color: "bg-emerald-400 text-white" },
    hold: { label: "Hold", color: "bg-yellow-500 text-white" },
    sell: { label: "Sell", color: "bg-red-400 text-white" },
    strong_sell: { label: "Strong Sell", color: "bg-red-600 text-white" },
    underperform: { label: "Underperform", color: "bg-red-400 text-white" },
    outperform: { label: "Outperform", color: "bg-emerald-400 text-white" },
  };
  const info = map[rec] || { label: rec || "N/A", color: "bg-muted text-muted-foreground" };
  return <Badge className={`${info.color} text-xs`}>{info.label}</Badge>;
}

function GradeChange({ from, to }: { from: string; to: string }) {
  const bullish = ["Buy", "Outperform", "Overweight", "Strong Buy", "Positive"];
  const isBullish = bullish.some((b) => to.includes(b));
  return (
    <div className="flex items-center gap-1 text-xs">
      {from && <span className="text-muted-foreground">{from}</span>}
      {from && <span className="text-muted-foreground">→</span>}
      <span className={isBullish ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>{to}</span>
    </div>
  );
}

function AnalystCard({ data }: { data: AnalystData }) {
  const { t } = useI18n();
  const upside = data.price > 0 ? ((data.targetMean - data.price) / data.price) * 100 : 0;
  const total = data.strongBuy + data.buy + data.hold + data.sell + data.strongSell;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Ratings + Targets */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{data.symbol}</CardTitle>
                <CardDescription>{data.name}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <ConsensusLabel rec={data.recommendation} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t("targetMean")}</p>
                <p className="text-lg font-bold">${data.targetMean.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t("upside")}</p>
                <p className={`text-lg font-bold flex items-center gap-1 ${upside >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {upside >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t("targetHigh")}</p>
                <p className="text-lg font-bold">${data.targetHigh.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t("targetLow")}</p>
                <p className="text-lg font-bold">${data.targetLow.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">{t("analystRatings")} ({data.numberOfAnalysts} {t("analysts")})</p>
            <div className="space-y-2">
              <RatingBar label={t("strongBuy")} value={data.strongBuy} total={total} color="bg-emerald-500" />
              <RatingBar label={t("buy")} value={data.buy} total={total} color="bg-emerald-400" />
              <RatingBar label={t("hold")} value={data.hold} total={total} color="bg-yellow-500" />
              <RatingBar label={t("sell")} value={data.sell} total={total} color="bg-red-400" />
              <RatingBar label={t("strongSell")} value={data.strongSell} total={total} color="bg-red-600" />
            </div>
          </CardContent>
        </Card>

        {data.upgrades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("recentUpgrades")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upgrades.map((u, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{u.firm}</p>
                      <GradeChange from={u.fromGrade} to={u.toGrade} />
                    </div>
                    <span className="text-xs text-muted-foreground">{u.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: TradingView chart */}
      <Card className="h-[600px]">
        <CardContent className="h-full p-4">
          <TradingViewWidget symbol={data.symbol} autosize />
        </CardContent>
      </Card>
    </div>
  );
}

function MiniAnalystCard({ data, onClick }: { data: AnalystData; onClick: () => void }) {
  const upside = data.price > 0 ? ((data.targetMean - data.price) / data.price) * 100 : 0;

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{data.symbol}</span>
            <ConsensusLabel rec={data.recommendation} />
          </div>
          <span className="font-bold">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Target: ${data.targetMean.toFixed(2)}</span>
          <span className={`font-medium flex items-center gap-1 ${upside >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {upside >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{data.numberOfAnalysts} analysts</p>
      </CardContent>
    </Card>
  );
}

export default function WallStreetPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<AnalystData | null>(null);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [topPicks, setTopPicks] = useState<AnalystData[]>([]);
  const [loadingPicks, setLoadingPicks] = useState(true);
  const [thoughts, setThoughts] = useState("");
  const [loadingThoughts, setLoadingThoughts] = useState(false);
  const [thoughtsInput, setThoughtsInput] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchAnalyst = useCallback(async (symbol: string) => {
    setLoadingSelected(true);
    try {
      const res = await fetch(`/api/analysts?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        if (data.symbol) setSelected(data);
        else setSelected(null);
      }
    } finally {
      setLoadingSelected(false);
    }
  }, []);

  useEffect(() => {
    async function loadPicks() {
      setLoadingPicks(true);
      try {
        const res = await fetch(`/api/analysts?symbols=${TOP_PICKS.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setTopPicks(Object.values(data.analysts || {}));
        }
      } finally {
        setLoadingPicks(false);
      }
    }
    loadPicks();
  }, []);

  useEffect(() => {
    if (topPicks.length === 0 || thoughts) return;
    async function autoGenerateThoughts() {
      setLoadingThoughts(true);
      try {
        const analystContext = `Current Wall Street consensus for major stocks:\n${topPicks.map((p) => `${p.symbol}: ${p.recommendation} — $${p.price} (target $${p.targetMean}, ${p.numberOfAnalysts} analysts, ${p.strongBuy + p.buy} buy vs ${p.sell + p.strongSell} sell)`).join("\n")}`;
        const prompt = `Give me your market thoughts for today based on this Wall Street analyst data:\n\n${analystContext}\n\nProvide:\n1. Current market regime (bull/bear/transition)\n2. Key risks and catalysts ahead\n3. Sector rotation opportunities\n4. What smart money is doing\n5. Your bold prediction for the next 30 days\n\nBe specific with tickers, levels, and percentages. Take a clear stance.`;
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt }),
        });
        if (res.ok) {
          const data = await res.json();
          setThoughts(data.answer || "");
        }
      } finally {
        setLoadingThoughts(false);
      }
    }
    autoGenerateThoughts();
  }, [topPicks, thoughts]);

  function handleSearch(value: string) {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setShowResults(true);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } finally {
        setSearching(false);
      }
    }, 300);
  }

  function selectStock(symbol: string) {
    setShowResults(false);
    setQuery("");
    fetchAnalyst(symbol);
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{t("wallStreet")}</h1>
      <p className="text-muted-foreground mb-6">{t("wallStreetDesc")}</p>

      {/* Search */}
      <div className="relative mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchAnalyst")}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            className="pl-10 text-[15px]"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => { setQuery(""); setShowResults(false); setSearchResults([]); }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {showResults && (searchResults.length > 0 || searching) && (
          <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto">
            <CardContent className="p-2">
              {searching && (
                <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Searching...
                </div>
              )}
              {searchResults.map((r) => (
                <button
                  key={r.symbol}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-md hover:bg-accent transition-colors text-left"
                  onClick={() => selectStock(r.symbol)}
                >
                  <div>
                    <span className="font-medium">{r.symbol}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{r.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{r.exchange}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected stock analyst data */}
      {loadingSelected && (
        <Card className="mb-8">
          <CardContent className="py-12 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("loading")}</span>
          </CardContent>
        </Card>
      )}

      {!loadingSelected && selected && (
        <div className="mb-8">
          <AnalystCard data={selected} />
        </div>
      )}

      {/* Market Thoughts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            {t("marketThoughts")}
          </CardTitle>
          <CardDescription>{t("marketThoughtsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const q = thoughtsInput.trim() || t("thoughtsPrompt");
              setLoadingThoughts(true);
              try {
                const analystContext = topPicks.length > 0
                  ? `\n\nCurrent Wall Street consensus for major stocks:\n${topPicks.map((p) => `${p.symbol}: ${p.recommendation} — $${p.price} (target $${p.targetMean}, ${p.numberOfAnalysts} analysts, ${p.strongBuy + p.buy} buy vs ${p.sell + p.strongSell} sell)`).join("\n")}`
                  : "";
                const prompt = `${q}${analystContext}\n\nProvide detailed market thoughts as a senior Wall Street strategist. Cover:\n1. Current market regime (bull/bear/transition)\n2. Key risks and catalysts ahead\n3. Sector rotation opportunities\n4. What smart money is doing\n5. Your bold prediction for the next 30 days\n\nBe specific with tickers, levels, and percentages. Take a clear stance — don't hedge.`;
                const res = await fetch("/api/ask", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ question: prompt }),
                });
                if (res.ok) {
                  const data = await res.json();
                  setThoughts(data.answer || "");
                }
              } finally {
                setLoadingThoughts(false);
              }
            }}
            className="flex gap-2 mb-4"
          >
            <Input
              placeholder={t("thoughtsPrompt")}
              value={thoughtsInput}
              onChange={(e) => setThoughtsInput(e.target.value)}
              className="text-sm"
            />
            <Button type="submit" disabled={loadingThoughts}>
              {loadingThoughts ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          {loadingThoughts && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("analyzing")}</span>
            </div>
          )}
          {thoughts && !loadingThoughts && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
              {thoughts}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top picks grid */}
      <h2 className="text-lg font-semibold mb-4">{t("topPicks")}</h2>
      {loadingPicks ? (
        <Card>
          <CardContent className="py-12 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("loading")}</span>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topPicks.map((d) => (
            <MiniAnalystCard key={d.symbol} data={d} onClick={() => setSelected(d)} />
          ))}
        </div>
      )}
    </div>
  );
}
