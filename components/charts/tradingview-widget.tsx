"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  interval?: string;
  theme?: "light" | "dark";
  autosize?: boolean;
}

function TradingViewWidgetInner({
  symbol,
  height = 400,
  interval = "D",
  theme,
  autosize = false,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const isDark =
      theme ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: isDark,
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
      height: autosize ? "100%" : height,
      width: "100%",
      hide_side_toolbar: false,
      withdateranges: true,
      hide_volume: false,
      calendar: false,
    });

    containerRef.current.appendChild(script);
  }, [symbol, interval, theme, height, autosize]);

  return (
    <div
      ref={containerRef}
      style={{ height: autosize ? "100%" : height, width: "100%" }}
    />
  );
}

export const TradingViewWidget = memo(TradingViewWidgetInner);
