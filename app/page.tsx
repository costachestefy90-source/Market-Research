"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CandlestickChart,
  Bitcoin,
  FileText,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const recentFindings = [
  {
    title: "S&P 500 Breadth Divergence Analysis",
    domain: "Equities",
    date: "2026-07-15",
    slug: "sp500-breadth-divergence",
    abstract:
      "Market breadth has narrowed significantly — top 10 stocks account for 38% of index weight. Historical parallels suggest elevated risk of mean-reversion.",
  },
  {
    title: "Bitcoin On-Chain: Holder Cohort Behavior",
    domain: "Crypto",
    date: "2026-07-12",
    slug: "btc-holder-cohorts",
    abstract:
      "Long-term holder supply ratio hit 14-month high. Analyzing what previous similar readings preceded in terms of price action.",
  },
  {
    title: "Yield Curve Normalization: What History Says",
    domain: "Macro",
    date: "2026-07-08",
    slug: "yield-curve-normalization",
    abstract:
      "After 18 months inverted, the 2s10s has normalized. Examining the lag between normalization and recession onset across 6 cycles.",
  },
];

export default function HomePage() {
  const { t } = useI18n();

  const domains = [
    {
      title: t("stocks"),
      description: "Search, track, and analyze any stock in real time",
      icon: CandlestickChart,
      href: "/stocks",
      color: "text-emerald-500",
    },
    {
      title: t("crypto"),
      description: "On-chain metrics, DeFi flows, token analysis",
      icon: Bitcoin,
      href: "/dashboard/crypto",
      color: "text-orange-500",
    },
    {
      title: t("ask"),
      description: "AI-powered market analysis on demand",
      icon: MessageSquare,
      href: "/ask",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t("marketResearch")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("dataDriven")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {domains.map((d) => (
          <Link key={d.title} href={d.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <d.icon className={`h-5 w-5 ${d.color} mb-1`} />
                <CardTitle className="text-base">{d.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{d.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("recentFindings")}
        </h2>
        <Link
          href="/research"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {t("allResearch")} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-4">
        {recentFindings.map((f) => (
          <Link key={f.slug} href={`/research/${f.slug}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{f.domain}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {f.date}
                  </span>
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.abstract}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-10 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{t("methodology")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("methodologyText")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
