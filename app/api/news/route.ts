import { NextRequest, NextResponse } from "next/server";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  description: string;
}

function parseRSSItems(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>|<title>([\s\S]*?)<\/title>/)?.[1] || block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
    const desc = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>|<description>([\s\S]*?)<\/description>/)?.[1] || block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
    if (title) {
      items.push({
        title: title.replace(/<[^>]*>/g, "").trim(),
        link: link.trim(),
        source,
        pubDate,
        description: desc.replace(/<[^>]*>/g, "").trim().slice(0, 300),
      });
    }
  }
  return items;
}

const RSS_FEEDS = [
  { url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US", source: "Yahoo Finance" },
  { url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^DJI&region=US&lang=en-US", source: "Yahoo Finance" },
  { url: "https://news.google.com/rss/search?q=stock+market+economy&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=federal+reserve+interest+rates&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=geopolitics+trade+war+sanctions&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
];

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || "all";

  let feeds = RSS_FEEDS;
  if (category === "macro") {
    feeds = RSS_FEEDS.filter((f) => f.url.includes("federal+reserve") || f.url.includes("geopolitics"));
  } else if (category === "stocks") {
    feeds = RSS_FEEDS.filter((f) => f.url.includes("GSPC") || f.url.includes("DJI") || f.url.includes("stock+market"));
  }

  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 },
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return parseRSSItems(xml, feed.source);
    })
  );

  const allNews: NewsItem[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const item of r.value) {
        const key = item.title.toLowerCase().slice(0, 50);
        if (!seen.has(key)) {
          seen.add(key);
          allNews.push(item);
        }
      }
    }
  }

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return NextResponse.json({ news: allNews.slice(0, 50) });
}
