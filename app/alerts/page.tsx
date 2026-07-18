"use client";

import { useEffect, useState, useRef } from "react";
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
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  type PriceAlert,
  getAlerts,
  addAlert,
  removeAlert,
  checkAlerts,
  requestNotificationPermission,
} from "@/lib/alerts";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export default function AlertsPage() {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [alertTarget, setAlertTarget] = useState("");
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setAlerts(getAlerts());
    if ("Notification" in window) {
      setNotifEnabled(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    checkAlerts();
    const interval = setInterval(() => {
      checkAlerts();
      setAlerts(getAlerts());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const symbols = [...new Set(alerts.filter((a) => !a.triggered).map((a) => a.symbol))];
    if (symbols.length === 0) return;
    fetch(`/api/quote?symbols=${symbols.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        const prices: Record<string, number> = {};
        for (const [sym, q] of Object.entries(data.quotes || {})) {
          prices[sym] = (q as { price: number }).price;
        }
        setCurrentPrices(prices);
      })
      .catch(() => {});
  }, [alerts]);

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

  function selectSymbol(symbol: string) {
    setSelectedSymbol(symbol);
    setQuery("");
    setShowResults(false);
    setSearchResults([]);
  }

  function createAlert() {
    if (!selectedSymbol || !alertTarget) return;
    addAlert({
      symbol: selectedSymbol,
      type: alertType,
      target: parseFloat(alertTarget),
    });
    setAlerts(getAlerts());
    setSelectedSymbol("");
    setAlertTarget("");
  }

  async function enableNotifications() {
    const granted = await requestNotificationPermission();
    setNotifEnabled(granted);
  }

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-6 w-6" />
          {t("alertsTitle")}
        </h1>
        {!notifEnabled && (
          <Button variant="outline" size="sm" onClick={enableNotifications}>
            <BellRing className="h-3.5 w-3.5 mr-1.5" /> Enable Notifications
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mb-6">{t("alertsDesc")}</p>

      {/* Create alert */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">{t("createAlert")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Symbol search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stock..."
                value={selectedSymbol || query}
                onChange={(e) => {
                  setSelectedSymbol("");
                  handleSearch(e.target.value);
                }}
                className="pl-10 text-sm"
              />
              {selectedSymbol && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSelectedSymbol("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {showResults && (searchResults.length > 0 || searching) && (
                <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
                  <CardContent className="p-2">
                    {searching && (
                      <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Searching...
                      </div>
                    )}
                    {searchResults.map((r) => (
                      <button
                        key={r.symbol}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
                        onClick={() => selectSymbol(r.symbol)}
                      >
                        <span className="font-medium">{r.symbol}</span>
                        <span className="text-muted-foreground text-xs">{r.name}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Type */}
            <div className="flex gap-1">
              <Button
                variant={alertType === "above" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertType("above")}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" /> Above
              </Button>
              <Button
                variant={alertType === "below" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertType("below")}
                className="text-xs"
              >
                <TrendingDown className="h-3 w-3 mr-1" /> Below
              </Button>
            </div>

            {/* Price */}
            <Input
              type="number"
              step="0.01"
              placeholder="Price target"
              value={alertTarget}
              onChange={(e) => setAlertTarget(e.target.value)}
              className="w-32 text-sm"
            />

            <Button onClick={createAlert} disabled={!selectedSymbol || !alertTarget}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active alerts */}
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Bell className="h-4 w-4" /> Active ({activeAlerts.length})
      </h2>
      {activeAlerts.length === 0 ? (
        <Card className="border-dashed mb-8">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No active alerts. Create one above.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 mb-8">
          {activeAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">{alert.symbol}</Badge>
                  <span className="text-sm">
                    {alert.type === "above" ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Above ${alert.target}
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> Below ${alert.target}
                      </span>
                    )}
                  </span>
                  {currentPrices[alert.symbol] && (
                    <span className="text-xs text-muted-foreground">
                      Now: ${currentPrices[alert.symbol].toFixed(2)}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    removeAlert(alert.id);
                    setAlerts(getAlerts());
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Triggered alerts */}
      {triggeredAlerts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" /> Triggered ({triggeredAlerts.length})
          </h2>
          <div className="space-y-2">
            {triggeredAlerts.map((alert) => (
              <Card key={alert.id} className="opacity-60">
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">{alert.symbol}</Badge>
                    <span className="text-sm text-muted-foreground line-through">
                      {alert.type === "above" ? "Above" : "Below"} ${alert.target}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      removeAlert(alert.id);
                      setAlerts(getAlerts());
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
