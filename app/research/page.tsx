import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    title: "S&P 500 Breadth Divergence Analysis",
    domain: "Equities",
    date: "2026-07-15",
    slug: "sp500-breadth-divergence",
    abstract:
      "Market breadth has narrowed significantly — top 10 stocks account for 38% of index weight. Historical parallels suggest elevated risk of mean-reversion.",
    readTime: "8 min",
  },
  {
    title: "Bitcoin On-Chain: Holder Cohort Behavior",
    domain: "Crypto",
    date: "2026-07-12",
    slug: "btc-holder-cohorts",
    abstract:
      "Long-term holder supply ratio hit 14-month high. Analyzing what previous similar readings preceded in terms of price action.",
    readTime: "12 min",
  },
  {
    title: "Yield Curve Normalization: What History Says",
    domain: "Macro",
    date: "2026-07-08",
    slug: "yield-curve-normalization",
    abstract:
      "After 18 months inverted, the 2s10s has normalized. Examining the lag between normalization and recession onset across 6 cycles.",
    readTime: "15 min",
  },
  {
    title: "Prediction Market Calibration: Are Markets Efficient?",
    domain: "Predictions",
    date: "2026-07-01",
    slug: "prediction-market-calibration",
    abstract:
      "Backtesting 2,400 resolved Polymarket contracts. Markets are well-calibrated at the extremes but show systematic overconfidence in the 30-70% range.",
    readTime: "10 min",
  },
  {
    title: "Sector Rotation Signals: A Quantitative Framework",
    domain: "Equities",
    date: "2026-06-25",
    slug: "sector-rotation-signals",
    abstract:
      "Building a momentum + macro composite signal for sector allocation. Backtest results from 2005-2026.",
    readTime: "20 min",
  },
];

const domainColors: Record<string, string> = {
  Equities: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  Crypto: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  Macro: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  Predictions: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
};

export default function ResearchPage() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Research</h1>
      <p className="text-muted-foreground mb-8">
        Original analysis and data-driven findings.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge variant="secondary" className="cursor-pointer">
          All
        </Badge>
        {Object.keys(domainColors).map((d) => (
          <Badge key={d} variant="outline" className="cursor-pointer">
            {d}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4">
        {articles.map((a) => (
          <Link key={a.slug} href={`/research/${a.slug}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={domainColors[a.domain]}>{a.domain}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {a.date}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {a.readTime}
                  </span>
                </div>
                <CardTitle className="text-lg">{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{a.abstract}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
