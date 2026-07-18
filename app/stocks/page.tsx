"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
import { DragCard } from "@/components/drag-card";
import { DraggableGrid, type GridItem } from "@/components/draggable-grid";
import {
  Search,
  Star,
  Loader2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  prevClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  currency: string;
  exchange: string;
  history: { date: string; close: number }[];
}

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("stock-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  function toggle(symbol: string) {
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem("stock-favorites", JSON.stringify(next));
      return next;
    });
  }

  return { favorites, toggle, isFav: (s: string) => favorites.includes(s) };
}

function tvSymbol(quote: StockQuote) {
  const usExchanges = ["NMS", "NYQ", "NGM", "NYSE", "NASDAQ"];
  return usExchanges.includes(quote.exchange) ? quote.symbol : `${quote.exchange}:${quote.symbol}`;
}

function StockInfoHeader({ quote, isFav, onToggleFav }: { quote: StockQuote; isFav: boolean; onToggleFav: () => void }) {
  const { t } = useI18n();
  const isUp = quote.change >= 0;

  return (
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{quote.symbol}</span>
          <Badge variant="outline" className="text-xs">{quote.exchange}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{quote.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleFav} title={isFav ? t("removeFavorite") : t("addFavorite")}>
          <Star className={`h-4 w-4 ${isFav ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
        </Button>
        <div className="text-right">
          <div className="text-2xl font-bold">
            ${quote.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-medium flex items-center gap-1 justify-end ${isUp ? "text-emerald-500" : "text-red-500"}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isUp ? "+" : ""}{quote.change}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StocksPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loadingQuotes, setLoadingQuotes] = useState<Set<string>>(new Set());
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const { favorites, toggle, isFav } = useFavorites();
  const [favQuotes, setFavQuotes] = useState<Record<string, StockQuote>>({});
  const [loadingFavs, setLoadingFavs] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showResults, setShowResults] = useState(false);

  const fetchQuote = useCallback(async (symbol: string) => {
    setLoadingQuotes((prev) => new Set(prev).add(symbol));
    try {
      const res = await fetch(`/api/quote?symbols=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        if (data.quotes[symbol]) {
          setQuotes((prev) => ({ ...prev, [symbol]: data.quotes[symbol] }));
        }
      }
    } finally {
      setLoadingQuotes((prev) => {
        const next = new Set(prev);
        next.delete(symbol);
        return next;
      });
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setFavQuotes({});
      return;
    }
    setLoadingFavs(true);
    try {
      const res = await fetch(`/api/quote?symbols=${favorites.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setFavQuotes(data.quotes || {});
      }
    } finally {
      setLoadingFavs(false);
    }
  }, [favorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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
    setSelectedSymbol(symbol);
    setShowResults(false);
    setQuery("");
    if (!quotes[symbol]) fetchQuote(symbol);
  }

  const selectedQuote = selectedSymbol ? quotes[selectedSymbol] : null;

  const favGridItems: GridItem[] = useMemo(() => {
    return favorites
      .filter((sym) => favQuotes[sym])
      .map((sym) => {
        const q = favQuotes[sym];
        return {
          id: `fav-${sym}`,
          defaultW: 6, defaultH: 6, minW: 4, minH: 4,
          content: (
            <DragCard title={q.symbol} description={q.name}>
              <div className="flex flex-col h-full">
                <StockInfoHeader quote={q} isFav={true} onToggleFav={() => toggle(sym)} />
                <div className="flex-1 min-h-0">
                  <TradingViewWidget symbol={tvSymbol(q)} autosize />
                </div>
              </div>
            </DragCard>
          ),
        };
      });
  }, [favorites, favQuotes, toggle]);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{t("stocks")}</h1>
      <p className="text-muted-foreground mb-6">{t("livePrices")}</p>

      {/* Search */}
      <div className="relative mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{r.type}</Badge>
                    <span className="text-xs text-muted-foreground">{r.exchange}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected stock — full-width draggable */}
      {selectedSymbol && (
        <div className="mb-8">
          {loadingQuotes.has(selectedSymbol) ? (
            <Card>
              <CardContent className="py-12 flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("loading")}</span>
              </CardContent>
            </Card>
          ) : selectedQuote ? (
            <DraggableGrid
              storageKey={`stock-${selectedSymbol}`}
              items={[{
                id: `selected-${selectedSymbol}`,
                defaultW: 12, defaultH: 6, minW: 6, minH: 4,
                content: (
                  <DragCard title={selectedQuote.symbol} description={selectedQuote.name}>
                    <div className="flex flex-col h-full">
                      <StockInfoHeader quote={selectedQuote} isFav={isFav(selectedSymbol)} onToggleFav={() => toggle(selectedSymbol)} />
                      <div className="flex-1 min-h-0">
                        <TradingViewWidget symbol={tvSymbol(selectedQuote)} autosize />
                      </div>
                    </div>
                  </DragCard>
                ),
              }]}
            />
          ) : null}
        </div>
      )}

      {/* Favorites */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          {t("favorites")}
        </h2>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={fetchFavorites}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> {t("refresh")}
          </Button>
        )}
      </div>

      {loadingFavs ? (
        <Card>
          <CardContent className="py-12 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("loading")}</span>
          </CardContent>
        </Card>
      ) : favorites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t("noFavorites")}
          </CardContent>
        </Card>
      ) : favGridItems.length > 0 ? (
        <DraggableGrid items={favGridItems} storageKey="stock-favorites-grid" />
      ) : null}
    </div>
  );
}
