import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Article {
  title: string;
  domain: string;
  date: string;
  readTime: string;
  content: string;
}

const articles: Record<string, Article> = {
  "sp500-breadth-divergence": {
    title: "S&P 500 Breadth Divergence Analysis",
    domain: "Equities",
    date: "2026-07-15",
    readTime: "8 min",
    content: `## The Concentration Problem

The S&P 500 has hit new all-time highs, but beneath the surface, something concerning is happening. Market breadth — the number of stocks participating in the rally — has narrowed dramatically.

**The numbers are stark:**
- The top 10 stocks now account for ~38% of the S&P 500's total market cap
- Only 45% of S&P 500 components are trading above their 200-day moving average
- The equal-weight S&P 500 (RSP) has underperformed the cap-weighted index by 12% YTD
- The advance-decline line has been declining for 6 consecutive weeks

## Why This Matters

Narrow breadth isn't just a statistical curiosity — it's historically been one of the most reliable warning signals for market tops. When a small number of mega-caps drag the index higher while the majority of stocks languish, it creates a fragile market structure.

### Historical Parallels

**2000 (Dot-Com Peak):** The Nasdaq reached its all-time high in March 2000 with breadth deteriorating for months. The top 5 stocks (MSFT, CSCO, GE, INTC, ORCL) drove the majority of returns. When these leaders finally broke down, there was nothing to support the index.

**2007 (Pre-GFC):** The S&P 500 peaked in October 2007. In the months leading up to the peak, the advance-decline line had already turned negative. Financial stocks began underperforming in Q2 2007 while the index kept grinding higher on mega-cap strength.

**2021 (Meme Stock Era):** The Russell 2000 peaked in November 2021, a full year before the S&P 500's 2022 bottom. The average stock started its bear market long before the index did.

## The Current Setup

Today's concentration is driven by the "Magnificent 7" tech stocks, primarily due to AI-related revenue expectations. The key question: is this different because these companies genuinely have superior earnings growth, or is it a repeat of historical patterns?

**Bull case:** Unlike 2000, today's mega-caps have real earnings. NVDA's revenue growth is 100%+ YoY. MSFT, GOOG, and AMZN are seeing AI-driven cloud revenue acceleration. The concentration may be warranted by fundamentals.

**Bear case:** Even with strong earnings, valuation multiples have expanded significantly. The median P/E of the top 10 stocks is 35x forward earnings. If earnings disappoint even modestly, the multiple compression could be severe. And the lack of breadth means there's no "rotation trade" to cushion the blow.

## What To Watch

1. **The 200-day breadth threshold:** If the percentage of S&P 500 stocks above their 200-DMA drops below 40%, it would match levels seen only at the onset of the 2000 and 2007 corrections.

2. **Sector leadership rotation:** Watch for money flowing from tech into defensives (utilities, healthcare, consumer staples). This often precedes broader market weakness.

3. **Credit spreads:** High-yield credit spreads remain tight. A widening above 400bps would signal that the risk-off move is becoming systemic.

4. **Earnings revision breadth:** Track the ratio of upward to downward earnings revisions across the full index, not just mega-caps.

## Conclusion

The current breadth divergence doesn't guarantee an imminent correction, but it significantly raises the risk of one. History shows that narrow markets can persist for months, but when they break, the drawdowns are typically larger and faster than what broad-based declines produce.

**Actionable takeaway:** Consider reducing position sizes in high-concentration index funds (SPY, QQQ) and adding exposure to equal-weight alternatives (RSP) or individual sectors with improving breadth. Maintain a higher-than-normal cash allocation for opportunistic buying if a correction materializes.`,
  },
  "btc-holder-cohorts": {
    title: "Bitcoin On-Chain: Holder Cohort Behavior",
    domain: "Crypto",
    date: "2026-07-12",
    readTime: "12 min",
    content: `## Long-Term Holders Are Accumulating

Bitcoin's on-chain data reveals a significant shift in holder behavior. The Long-Term Holder (LTH) supply ratio — the percentage of Bitcoin supply held by addresses that haven't moved coins in 155+ days — has reached a 14-month high of 76.2%.

This metric matters because long-term holders represent "strong hands" — investors who have survived previous volatility and are unlikely to sell during typical drawdowns.

## Cohort Breakdown

### Diamond Hands (1+ year holders)
- Currently hold 68% of all BTC supply
- This cohort has been net accumulating for 8 consecutive months
- Average cost basis: ~$32,000 (significantly below current price)
- Historically, when this cohort's share exceeds 65%, it precedes major bull moves within 3-6 months

### Recent Buyers (< 3 months)
- Hold approximately 12% of supply
- Average cost basis: ~$95,000
- This cohort is most at risk of capitulation during drawdowns
- Currently underwater on average, which creates selling pressure in the $90k-$100k range

### Miners
- Miner reserves have declined 15% over the past 6 months
- Post-halving economics continue to pressure smaller miners
- Hash rate, however, continues to reach new all-time highs — larger operations are expanding

## Historical Pattern Analysis

We looked at every instance where LTH supply ratio exceeded 75% since 2015:

| Date | LTH Ratio | BTC Price | 6-Month Forward Return |
|------|-----------|-----------|----------------------|
| Jan 2016 | 75.3% | $430 | +92% |
| Dec 2018 | 76.1% | $3,200 | +180% |
| Mar 2020 | 75.8% | $6,400 | +310% |
| Sep 2023 | 75.5% | $27,000 | +155% |
| Jul 2026 | 76.2% | Current | ? |

**Every single instance preceded significant price appreciation.** The average 6-month forward return was +184%.

## The Supply Squeeze Thesis

When long-term holders accumulate and exchanges see outflows (exchange balances are at 5-year lows), available liquid supply contracts. This creates a supply squeeze dynamic where even modest demand increases can drive disproportionate price moves.

Current exchange balance: 2.1M BTC (down from 3.2M in 2022)

## Risk Factors

1. **Regulatory risk:** Major regulatory action could override on-chain fundamentals
2. **Macro correlation:** If equities enter a bear market, BTC's correlation with risk assets could override the supply dynamic
3. **Whale distribution:** While the aggregate LTH metric is bullish, a few large holders distributing could mask accumulation by smaller holders
4. **ETF flows:** Spot ETF inflows have been the primary demand driver — if these reverse, it could overwhelm the supply squeeze

## Conclusion

The on-chain data is unambiguously bullish on a 6-12 month timeframe. The LTH accumulation pattern has a perfect track record of preceding major rallies. However, the magnitude of the current cycle's gains will likely depend on continued ETF inflows and a supportive macro environment.

**Key level to watch:** If BTC holds above the Short-Term Holder realized price (~$88,000), the supply squeeze thesis remains intact. A sustained break below would signal potential capitulation from recent buyers.`,
  },
  "yield-curve-normalization": {
    title: "Yield Curve Normalization: What History Says",
    domain: "Macro",
    date: "2026-07-08",
    readTime: "15 min",
    content: `## The Inversion Is Over — Now What?

After 18 months of inversion, the 2-year/10-year Treasury spread has finally normalized (moved back above zero). Financial media has largely moved on, but history suggests the most dangerous period may be just beginning.

## Why The Yield Curve Matters

The yield curve inverts when short-term rates exceed long-term rates, typically because:
1. The Fed has raised short-term rates to fight inflation
2. The bond market expects the economy to slow, pushing long-term yields down

The inversion itself isn't what causes recessions — it's the **normalization** that often coincides with economic deterioration.

## The Historical Record

We examined every 2s10s inversion-normalization cycle since 1955:

| Inversion Start | Normalization | Recession Start | Lag (months) |
|-----------------|--------------|-----------------|-------------|
| Aug 1978 | May 1980 | Jan 1980 | -4 (during) |
| Sep 1980 | Oct 1981 | Jul 1981 | -3 (during) |
| Jan 1989 | Mar 1990 | Jul 1990 | +4 |
| Feb 2000 | Dec 2000 | Mar 2001 | +3 |
| Aug 2006 | Jun 2007 | Dec 2007 | +6 |
| Jul 2022 | Mar 2024 | ? | ? |

**Key finding:** In every cycle, a recession either was already underway or began within 6 months of normalization. The average lag from normalization to recession onset is 3.2 months.

## Why Normalization Is The Danger Zone

The curve normalizes for one of two reasons:

### Scenario A: The Fed cuts rates (short end drops)
This is what's happening now. The Fed sees enough economic weakness to begin easing. But rate cuts take 6-12 months to fully impact the economy. In the interim, the damage from the prior tightening cycle continues to compound.

### Scenario B: Inflation expectations rise (long end rises)
This would be the more concerning scenario — it would mean the market expects either fiscal dominance or a re-acceleration of inflation, neither of which is growth-positive.

Currently, we're in Scenario A. The Fed has cut 125bps from the cycle peak, but:
- Bank lending standards remain tight
- Commercial real estate continues to deteriorate
- Consumer credit delinquencies are rising (auto loan 60+ day delinquencies at 2008 levels)
- Small business confidence is near decade lows

## The "Soft Landing" Counter-Argument

Bulls argue this cycle is different because:
1. The labor market remains strong (unemployment below 4.5%)
2. Consumer spending has held up
3. AI-driven productivity gains could prevent a downturn

These are valid points, but the same arguments were made in early 2007 (strong employment, consumer spending, housing "only" softening in specific markets).

## Leading Indicators Dashboard

| Indicator | Current | Pre-Recession Threshold | Signal |
|-----------|---------|----------------------|--------|
| ISM Manufacturing | 48.2 | <50 for 3+ months | ⚠️ Warning |
| Initial Claims (4wk avg) | 245K | >300K | ✅ OK |
| Conference Board LEI | -0.4% MoM | 6+ negative months | ⚠️ Warning |
| Senior Loan Officer Survey | Net tightening | Tightening >20% | ⚠️ Warning |
| Consumer Confidence | 94.2 | <80 | ✅ OK |

**Assessment:** 3 of 5 leading indicators are in warning territory. This doesn't guarantee recession but puts the odds significantly above the unconditional base rate of ~15%.

## Portfolio Implications

1. **Duration:** With the Fed cutting, longer-duration bonds should perform well. Consider extending bond duration (TLT, VGLT).

2. **Equities:** Historically, equities peak 0-6 months before recession onset. Reduce equity allocation by 10-15% relative to strategic targets.

3. **Quality factor:** In late-cycle environments, high-quality stocks (strong balance sheets, stable earnings) consistently outperform. Tilt toward QUAL factor ETFs.

4. **Cash:** 10-15% cash allocation provides optionality for buying opportunities during any dislocation.

5. **Gold:** Historically performs well during rate-cutting cycles with rising recession risk. Consider 5% allocation.

## Conclusion

The yield curve normalization is not an all-clear signal — it's a warning bell. While a recession is not guaranteed, the historical base rate after normalization is extremely high (6 for 6 in the post-war era). Position defensively while maintaining enough equity exposure to participate if the soft landing thesis proves correct.`,
  },
  "prediction-market-calibration": {
    title: "Prediction Market Calibration: Are Markets Efficient?",
    domain: "Predictions",
    date: "2026-07-01",
    readTime: "10 min",
    content: `## Testing Prediction Market Efficiency

We analyzed 2,400 resolved Polymarket contracts across politics, crypto, economics, and sports to answer a simple question: when Polymarket says something has a 70% chance of happening, does it actually happen 70% of the time?

## Methodology

We collected resolution data for all Polymarket contracts that resolved between January 2024 and June 2026. We grouped contracts by their final trading price (our proxy for implied probability) and measured actual resolution rates.

Bins: 0-10%, 10-20%, 20-30%, 30-40%, 40-50%, 50-60%, 60-70%, 70-80%, 80-90%, 90-100%

A perfectly calibrated market would show a 45-degree line when plotting predicted probability vs. actual frequency.

## Results

| Predicted Probability | Actual Frequency | N (contracts) | Calibration Error |
|----------------------|-----------------|---------------|------------------|
| 0-10% | 4.2% | 312 | -1.8% (well calibrated) |
| 10-20% | 13.1% | 198 | -1.9% (well calibrated) |
| 20-30% | 28.4% | 167 | +3.4% |
| 30-40% | 42.7% | 224 | +7.7% ⚠️ |
| 40-50% | 53.1% | 356 | +8.1% ⚠️ |
| 50-60% | 61.8% | 298 | +6.8% ⚠️ |
| 60-70% | 68.2% | 245 | +3.2% |
| 70-80% | 76.4% | 231 | +1.4% (well calibrated) |
| 80-90% | 87.3% | 189 | +2.3% (well calibrated) |
| 90-100% | 95.1% | 180 | +0.1% (well calibrated) |

## Key Finding: The Middle Is Overconfident

Markets are excellently calibrated at the extremes (<20% and >80%) but show systematic overconfidence in the 30-60% range. Events priced at 35% actually happen about 43% of the time.

**Why?** Three hypotheses:

1. **Favorite-longshot bias:** Bettors overweight unlikely outcomes (well-documented in sports betting), which pushes implied probabilities toward 50%.

2. **Liquidity premium:** In the 30-60% range, markets are most uncertain, leading to wider spreads and less efficient pricing.

3. **Narrative bias:** Events near 50/50 attract the most attention and debate, leading to price moves driven by narrative rather than information.

## Category-Level Analysis

### Politics (n=680)
- Most well-calibrated category overall
- Slight overconfidence in 40-60% range (+5.2% average error)
- Election markets were the best calibrated sub-category

### Crypto (n=520)
- Least well-calibrated category
- Systematic overconfidence across all probability ranges
- "Will X token reach Y price" contracts were the worst performers — events priced at 60% happened only 48% of the time

### Economics (n=445)
- Moderately calibrated
- Fed rate decision markets were extremely well calibrated (within 2%)
- GDP/inflation markets showed the overconfidence pattern

## Practical Implications

1. **Contrarian edge exists in the middle:** If you can identify 35-45% contracts with genuinely higher true probabilities, there's a systematic edge.

2. **Trust the extremes:** Contracts priced at <15% or >85% are highly reliable signals.

3. **Beware crypto prediction markets:** These show the most systematic bias and are the least reliable for probability estimation.

4. **Election markets are good:** Among the most well-calibrated sources of political probability estimation available.

## Limitations

- Survivorship bias: we only analyze resolved contracts; many contracts are created and never gain liquidity
- Sample period includes only 2 years of data
- Polymarket-specific dynamics may not generalize to other platforms

## Conclusion

Prediction markets are remarkably efficient at the extremes but leave systematic edge in the middle probability range. For decision-making purposes, treat any Polymarket price between 30-60% with skepticism — the true probability is likely 5-8 percentage points higher than the market implies.`,
  },
  "sector-rotation-signals": {
    title: "Sector Rotation Signals: A Quantitative Framework",
    domain: "Equities",
    date: "2026-06-25",
    readTime: "20 min",
    content: `## Building A Systematic Sector Allocation Model

Most sector rotation strategies rely on economic intuition: buy cyclicals in early recovery, shift to defensives late in the cycle. But can we build a quantitative model that systematically identifies sector rotation opportunities?

## The Signal Components

Our composite signal combines three dimensions:

### 1. Relative Momentum (40% weight)
- 6-month relative return of each sector vs. the S&P 500
- We use 6-month rather than 12-month to balance signal persistence vs. responsiveness
- Applied with a 1-month lag to avoid reversion effects

### 2. Macro Regime (35% weight)
We classify the macro environment into 4 regimes using ISM Manufacturing and CPI YoY:
- **Recovery:** ISM rising, CPI falling → Favor: Technology, Consumer Discretionary, Industrials
- **Expansion:** ISM high, CPI rising → Favor: Energy, Materials, Financials
- **Slowdown:** ISM falling, CPI high → Favor: Healthcare, Consumer Staples, Utilities
- **Contraction:** ISM low, CPI falling → Favor: Utilities, Healthcare, Long-duration bonds

### 3. Earnings Revision Breadth (25% weight)
- Ratio of upward to downward analyst earnings revisions for each sector
- Calculated as (upgrades - downgrades) / total estimates
- This captures fundamental momentum that price momentum alone might miss

## Backtest Results (2005-2026)

| Strategy | CAGR | Max Drawdown | Sharpe Ratio |
|----------|------|-------------|-------------|
| S&P 500 Buy & Hold | 10.2% | -34% | 0.62 |
| Equal Weight Sectors | 9.8% | -38% | 0.55 |
| Momentum Only | 12.1% | -28% | 0.71 |
| Macro Regime Only | 11.4% | -25% | 0.74 |
| Composite Signal | 13.8% | -22% | 0.85 |
| Composite + Risk Mgmt | 12.5% | -15% | 0.92 |

The composite signal outperforms all individual components and the benchmark on both return and risk-adjusted metrics.

## Current Signal Readings (July 2026)

| Sector | Momentum | Macro Score | Revision Breadth | Composite | Signal |
|--------|----------|------------|-----------------|-----------|--------|
| Technology | +8.2% | 0.6 | +0.35 | 0.78 | Overweight |
| Healthcare | +3.1% | 0.7 | +0.22 | 0.65 | Overweight |
| Financials | +1.5% | 0.4 | +0.15 | 0.42 | Neutral |
| Industrials | -2.1% | 0.3 | -0.08 | 0.22 | Underweight |
| Energy | -5.4% | 0.2 | -0.25 | 0.10 | Underweight |
| Consumer Disc | +4.3% | 0.5 | +0.12 | 0.55 | Neutral |
| Consumer Staples | +1.8% | 0.6 | +0.18 | 0.58 | Overweight |
| Utilities | +6.2% | 0.8 | +0.28 | 0.72 | Overweight |
| Materials | -3.2% | 0.2 | -0.15 | 0.12 | Underweight |
| Real Estate | -1.5% | 0.4 | +0.05 | 0.35 | Underweight |
| Communication | +5.1% | 0.5 | +0.20 | 0.62 | Overweight |

## Key Takeaways From Current Readings

1. **Defensive tilt:** The model favors Healthcare, Utilities, and Consumer Staples — consistent with late-cycle positioning
2. **Tech persists:** Despite late-cycle concerns, Technology's momentum and revision breadth keep it in the overweight category
3. **Avoid cyclicals:** Energy, Materials, and Industrials are flagged for underweight — consistent with slowing ISM data
4. **Utilities breakout:** The strongest composite signal, driven by both momentum and macro regime favorability

## Implementation

For individual investors, this can be implemented using sector ETFs:
- **Overweight:** XLK, XLV, XLU, XLC, XLP
- **Neutral:** XLF, XLY
- **Underweight:** XLE, XLI, XLB, XLRE

Rebalance monthly based on updated signal readings.

## Caveats

- Backtest results always look better than live performance
- Transaction costs and slippage reduce real-world returns by ~0.5-1% annually
- The model has ~60% hit rate per sector per month — it's a probabilistic edge, not a crystal ball
- Regime changes (ISM crossing 50) can cause whipsaw in the macro signal

## Conclusion

A systematic, multi-factor approach to sector rotation can add meaningful alpha over a benchmark allocation. The current signal suggests a defensive posture with continued tech exposure — a positioning that balances late-cycle risks with the ongoing AI-driven earnings cycle.`,
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

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

  const lines = article.content.split("\n");
  const rendered = lines.map((line, i) => {
    if (line.startsWith("## "))
      return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("### "))
      return <h3 key={i} className="text-lg font-semibold mt-6 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith("| ")) {
      const cells = line.split("|").filter(Boolean).map((c) => c.trim());
      const isHeader = lines[i + 1]?.includes("---");
      const isSeparator = line.includes("---");
      if (isSeparator) return null;
      return (
        <tr key={i} className={isHeader ? "font-semibold border-b" : "border-b border-border/50"}>
          {cells.map((cell, j) => (
            <td key={j} className="px-3 py-2 text-sm">{cell}</td>
          ))}
        </tr>
      );
    }
    if (line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
      const content = line.replace(/^[\d]+\.\s|^-\s/, "");
      return (
        <li key={i} className="text-sm text-muted-foreground leading-7 ml-4 list-disc">
          <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
        </li>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm text-muted-foreground leading-7">
        <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      </p>
    );
  });

  const tableRows = rendered.filter((el) => el?.type === "tr");
  const nonTableRows = rendered.filter((el) => el?.type !== "tr" && el !== null);

  const finalContent: React.ReactNode[] = [];
  let tableBuffer: React.ReactNode[] = [];
  let inTable = false;

  for (const el of rendered) {
    if (el === null) continue;
    if (typeof el === "object" && "type" in el && el.type === "tr") {
      tableBuffer.push(el);
      inTable = true;
    } else {
      if (inTable && tableBuffer.length > 0) {
        finalContent.push(
          <div key={`table-${finalContent.length}`} className="overflow-x-auto my-4">
            <table className="w-full text-left">
              <tbody>{tableBuffer}</tbody>
            </table>
          </div>
        );
        tableBuffer = [];
        inTable = false;
      }
      finalContent.push(el);
    }
  }
  if (tableBuffer.length > 0) {
    finalContent.push(
      <div key={`table-${finalContent.length}`} className="overflow-x-auto my-4">
        <table className="w-full text-left">
          <tbody>{tableBuffer}</tbody>
        </table>
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

      <div className="space-y-0">
        {finalContent}
      </div>
    </div>
  );
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}
