import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const articles: Record<
  string,
  { title: string; domain: string; date: string; readTime: string }
> = {
  "sp500-breadth-divergence": {
    title: "S&P 500 Breadth Divergence Analysis",
    domain: "Equities",
    date: "2026-07-15",
    readTime: "8 min",
  },
  "btc-holder-cohorts": {
    title: "Bitcoin On-Chain: Holder Cohort Behavior",
    domain: "Crypto",
    date: "2026-07-12",
    readTime: "12 min",
  },
  "yield-curve-normalization": {
    title: "Yield Curve Normalization: What History Says",
    domain: "Macro",
    date: "2026-07-08",
    readTime: "15 min",
  },
  "prediction-market-calibration": {
    title: "Prediction Market Calibration: Are Markets Efficient?",
    domain: "Predictions",
    date: "2026-07-01",
    readTime: "10 min",
  },
  "sector-rotation-signals": {
    title: "Sector Rotation Signals: A Quantitative Framework",
    domain: "Equities",
    date: "2026-06-25",
    readTime: "20 min",
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl">
        <Link
          href="/research"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to research
        </Link>
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-muted-foreground mt-2">
          This research article hasn&apos;t been written yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link
        href="/research"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-3 w-3" /> Back to research
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary">{article.domain}</Badge>
        <span className="text-xs text-muted-foreground">{article.date}</span>
        <span className="text-xs text-muted-foreground">
          · {article.readTime}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {article.title}
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground leading-7">
          This is a placeholder for the full research article. In production,
          this would render an MDX file from the <code>research/</code>{" "}
          directory with interactive charts, data tables, and statistical
          analysis.
        </p>
        <p className="text-muted-foreground leading-7 mt-4">
          To write this article, create a file at{" "}
          <code>research/2026/{slug}.mdx</code> and it will be rendered here
          with full MDX support including embedded React chart components.
        </p>
      </div>
    </div>
  );
}
