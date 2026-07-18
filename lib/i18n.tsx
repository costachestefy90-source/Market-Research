"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ro";

const translations = {
  en: {
    home: "Home",
    research: "Research",
    dashboard: "Dashboard",
    overview: "Overview",
    crypto: "Crypto",
    stocks: "Stocks",
    ask: "Ask",
    marketResearch: "Market Research",
    dataDriven: "Data-driven analysis and original findings across global markets.",
    recentFindings: "Recent Findings",
    allResearch: "All research",
    methodology: "Methodology",
    methodologyText: "All analysis uses publicly available data from Yahoo Finance, CoinGecko, FRED, DeFi Llama, and prediction market APIs. Code and datasets are open source. Findings include reproducible notebooks and statistical tests where applicable.",
    searchStocks: "Search stocks...",
    favorites: "Favorites",
    noFavorites: "No favorites yet. Search and star stocks to add them.",
    price: "Price",
    change: "Change",
    volume: "Volume",
    marketCap: "Market Cap",
    high: "High",
    low: "Low",
    open: "Open",
    prevClose: "Prev Close",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    refresh: "Refresh",
    loading: "Loading...",
    loadingMarket: "Loading live market data...",
    loadingCrypto: "Loading crypto data...",
    searchPlaceholder: "Search any stock, ETF, or index (e.g. AAPL, TSLA, VOO)",
    askQuestion: "What do you want to know about the markets?",
    askSubtitle: "Ask any market question — get a detailed, data-driven analysis. Download as PDF.",
    suggestedQuestions: "Suggested questions",
    analyzing: "Analyzing your question...",
    downloadPdf: "PDF",
    "30dayPrice": "30-day price",
    sectorPerformance: "Sector Performance",
    ytdReturns: "YTD returns",
    marketOverview: "Market Overview",
    livePrices: "Live prices and charts",
    searchResults: "Search Results",
    trending: "Trending",
    language: "Language",
  },
  ro: {
    home: "Acasă",
    research: "Cercetare",
    dashboard: "Panou",
    overview: "Prezentare",
    crypto: "Crypto",
    stocks: "Acțiuni",
    ask: "Întreabă",
    marketResearch: "Cercetare de Piață",
    dataDriven: "Analiză bazată pe date și descoperiri originale pe piețele globale.",
    recentFindings: "Descoperiri Recente",
    allResearch: "Toată cercetarea",
    methodology: "Metodologie",
    methodologyText: "Toate analizele folosesc date disponibile public de la Yahoo Finance, CoinGecko, FRED, DeFi Llama și API-uri de piețe de predicție. Codul și seturile de date sunt open source.",
    searchStocks: "Caută acțiuni...",
    favorites: "Favorite",
    noFavorites: "Niciun favorit încă. Caută și adaugă acțiuni la favorite.",
    price: "Preț",
    change: "Variație",
    volume: "Volum",
    marketCap: "Capitalizare",
    high: "Maxim",
    low: "Minim",
    open: "Deschidere",
    prevClose: "Închidere anterioară",
    addFavorite: "Adaugă la favorite",
    removeFavorite: "Șterge din favorite",
    refresh: "Reîmprospătare",
    loading: "Se încarcă...",
    loadingMarket: "Se încarcă datele de piață...",
    loadingCrypto: "Se încarcă datele crypto...",
    searchPlaceholder: "Caută orice acțiune, ETF sau index (ex. AAPL, TSLA, VOO)",
    askQuestion: "Ce vrei să afli despre piețe?",
    askSubtitle: "Pune orice întrebare despre piață — primești o analiză detaliată. Descarcă ca PDF.",
    suggestedQuestions: "Întrebări sugerate",
    analyzing: "Se analizează întrebarea ta...",
    downloadPdf: "PDF",
    "30dayPrice": "Preț 30 zile",
    sectorPerformance: "Performanță Sectorială",
    ytdReturns: "Randamente YTD",
    marketOverview: "Prezentare Piață",
    livePrices: "Prețuri și grafice live",
    searchResults: "Rezultate Căutare",
    trending: "Trending",
    language: "Limbă",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved && (saved === "en" || saved === "ro")) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] || translations.en[key] || key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
