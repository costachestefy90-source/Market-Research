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
  Loader2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Send,
  X,
  Newspaper,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  description: string;
}

interface AiResponse {
  loading: boolean;
  text: string;
}

const CATEGORIES = [
  { key: "all", icon: Globe },
  { key: "stocks", icon: TrendingUp },
  { key: "macro", icon: Zap },
] as const;

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NewsCard({
  item,
  onAnalyze,
  onAsk,
}: {
  item: NewsItem;
  onAnalyze: () => void;
  onAsk: () => void;
}) {
  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="secondary" className="text-xs shrink-0">
                {item.source}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {timeAgo(item.pubDate)}
              </span>
            </div>
            <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onAnalyze}>
            <Zap className="h-3.5 w-3.5 mr-1.5" /> Impact Analysis
          </Button>
          <Button variant="outline" size="sm" onClick={onAsk}>
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Discuss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  const { t } = useI18n();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [aiResponse, setAiResponse] = useState<AiResponse>({ loading: false, text: "" });
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function fetchNews(cat: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  async function analyzeImpact(item: NewsItem) {
    setSelectedNews(item);
    setChatMode(false);
    setChatHistory([]);
    setAiResponse({ loading: true, text: "" });

    const prompt = `Analyze this market news in extreme detail:

"${item.title}"
${item.description ? `\nContext: ${item.description}` : ""}

Provide:
1. **Summary** — what happened and why it matters
2. **Directly Impacted Stocks/Sectors** — list specific tickers and explain how each is affected (positive/negative + magnitude estimate)
3. **Indirect Ripple Effects** — second-order impacts on related industries, supply chains, currencies, commodities
4. **Historical Parallels** — similar events in the past and what happened to markets
5. **Short-term vs Long-term Outlook** — what to expect in the next week vs next quarter
6. **Key Risk Factors** — what could make this worse or better than expected
7. **Actionable Takeaway** — what a smart trader would consider doing

Be specific with ticker symbols, percentages, and concrete examples. Write like a senior Wall Street analyst briefing a trading desk.`;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse({ loading: false, text: data.answer || "No analysis available." });
      } else {
        setAiResponse({ loading: false, text: "Failed to analyze. Try again." });
      }
    } catch {
      setAiResponse({ loading: false, text: "Failed to analyze. Try again." });
    }
  }

  async function openChat(item: NewsItem) {
    setSelectedNews(item);
    setChatMode(true);
    setAiResponse({ loading: false, text: "" });
    setChatHistory([
      { role: "system", text: `Discussing: "${item.title}"` },
    ]);
  }

  async function sendChat() {
    if (!chatInput.trim() || !selectedNews) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);

    const context = `The user wants to discuss this market news:
"${selectedNews.title}"
${selectedNews.description ? `Context: ${selectedNews.description}` : ""}

Previous discussion:
${chatHistory.filter((m) => m.role !== "system").map((m) => `${m.role}: ${m.text}`).join("\n")}

User's new message: ${userMsg}

Respond as a senior market analyst. Be specific about tickers, sectors, price targets, and historical data. Give your honest assessment and trading implications.`;

    setChatHistory((prev) => [...prev, { role: "assistant", text: "..." }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: context }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: data.answer || "No response." };
          return updated;
        });
      }
    } catch {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: "Failed to respond." };
        return updated;
      });
    }
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          {t("newsTitle")}
        </h1>
        <Button variant="outline" size="sm" onClick={() => fetchNews(category)}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> {t("refresh")}
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">{t("newsDesc")}</p>

      {/* Categories */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <Button
            key={c.key}
            variant={category === c.key ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(c.key)}
          >
            <c.icon className="h-3.5 w-3.5 mr-1.5" />
            {t(`cat_${c.key}` as Parameters<typeof t>[0])}
          </Button>
        ))}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* News list */}
        <div className="flex-1 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("loading")}</span>
              </CardContent>
            </Card>
          ) : news.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No news available
              </CardContent>
            </Card>
          ) : (
            news.map((item, i) => (
              <NewsCard
                key={i}
                item={item}
                onAnalyze={() => analyzeImpact(item)}
                onAsk={() => openChat(item)}
              />
            ))
          )}
        </div>

        {/* Analysis / Chat panel */}
        {selectedNews && (
          <div className="lg:w-[480px] shrink-0 lg:sticky lg:top-6 lg:self-start">
            <Card className="h-[calc(100vh-8rem)] flex flex-col">
              <CardHeader className="pb-2 shrink-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-sm leading-snug">{selectedNews.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {chatMode ? "Discussion" : "Impact Analysis"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => {
                      setSelectedNews(null);
                      setChatMode(false);
                      setChatHistory([]);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto text-sm">
                {!chatMode ? (
                  aiResponse.loading ? (
                    <div className="flex items-center justify-center gap-3 py-12">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">{t("analyzing")}</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {aiResponse.text}
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    {chatHistory
                      .filter((m) => m.role !== "system")
                      .map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                              m.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {m.text === "..." ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <div className="whitespace-pre-wrap">{m.text}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </CardContent>
              {chatMode && (
                <div className="p-3 border-t shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendChat();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Ask about this news..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="text-sm"
                    />
                    <Button type="submit" size="icon" disabled={!chatInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
