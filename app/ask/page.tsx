"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Download,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface QA {
  question: string;
  answer: string;
  timestamp: string;
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = html.replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>");
  return `<p>${html}</p>`;
}

function renderMarkdown(md: string) {
  return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }} />;
}

const suggestedQuestions = [
  "What's the current state of the yield curve and what does it signal?",
  "Compare Bitcoin's current cycle to previous halving cycles",
  "Which sectors are showing relative strength in this market?",
  "How are prediction markets pricing the next Fed rate decision?",
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<QA[]>([]);
  const answerRef = useRef<HTMLDivElement>(null);

  async function handleAsk(q?: string) {
    const query = q || question;
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const qa: QA = {
        question: query.trim(),
        answer: data.answer,
        timestamp: new Date().toLocaleString(),
      };
      setHistory((prev) => [qa, ...prev]);
      setQuestion("");
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf(qa: QA) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Market Research — ${qa.question}</title>
        <style>
          @page { margin: 1in; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.7;
            color: #1a1a1a;
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .header {
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .header h1 {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #666;
            margin: 0 0 8px 0;
          }
          .question {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #111;
          }
          .meta {
            font-size: 12px;
            color: #888;
          }
          h1 { font-size: 22px; margin: 28px 0 12px; }
          h2 { font-size: 18px; margin: 24px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
          h3 { font-size: 15px; margin: 20px 0 8px; }
          p { margin: 0 0 12px; }
          ul, ol { margin: 0 0 12px; padding-left: 24px; }
          li { margin: 0 0 4px; }
          strong { font-weight: 600; }
          code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 13px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th { background: #f8f8f8; font-weight: 600; }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e5e5e5;
            font-size: 11px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Market Research</h1>
          <div class="question">${qa.question}</div>
          <div class="meta">${qa.timestamp}</div>
        </div>
        ${markdownToHtml(qa.answer)}
        <div class="footer">
          Generated by Market Research · ${qa.timestamp}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Ask</h1>
      <p className="text-muted-foreground mb-8">
        Ask any market question — get a detailed, data-driven analysis. Download
        as PDF.
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="What do you want to know about the markets?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
              disabled={loading}
              className="text-[15px]"
            />
            <Button onClick={() => handleAsk()} disabled={loading || !question.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive mt-3">{error}</p>
          )}

          {history.length === 0 && !loading && (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <Badge
                    key={q}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent text-xs py-1.5 px-3 font-normal"
                    onClick={() => {
                      setQuestion(q);
                      handleAsk(q);
                    }}
                  >
                    {q}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <Card className="mb-4">
          <CardContent className="py-12 flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Analyzing your question...
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4" ref={answerRef}>
        {history.map((qa, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {qa.timestamp}
                    </span>
                  </div>
                  <CardTitle className="text-base">{qa.question}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPdf(qa)}
                  className="shrink-0"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-[14px] leading-7 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:pb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs">
                {renderMarkdown(qa.answer)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
