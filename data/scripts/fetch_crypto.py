"""Fetch crypto data from CoinGecko (free API) and output JSON."""

import json
from pathlib import Path
import requests

OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

BASE = "https://api.coingecko.com/api/v3"


def fetch_price_history(coin_id: str, days: int = 90) -> list[dict]:
    url = f"{BASE}/coins/{coin_id}/market_chart"
    resp = requests.get(url, params={"vs_currency": "usd", "days": days})
    resp.raise_for_status()
    prices = resp.json()["prices"]
    return [{"timestamp": p[0], "price": round(p[1], 2)} for p in prices]


def fetch_market_overview() -> list[dict]:
    url = f"{BASE}/coins/markets"
    resp = requests.get(url, params={
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 20,
        "page": 1,
    })
    resp.raise_for_status()
    return [
        {
            "symbol": c["symbol"].upper(),
            "name": c["name"],
            "price": c["current_price"],
            "market_cap": c["market_cap"],
            "change_24h": round(c["price_change_percentage_24h"] or 0, 2),
            "volume": c["total_volume"],
        }
        for c in resp.json()
    ]


def fetch_defi_tvl() -> list[dict]:
    resp = requests.get("https://api.llama.fi/v2/historicalChainTvl")
    resp.raise_for_status()
    data = resp.json()[-90:]
    return [{"date": d["date"], "tvl": round(d["tvl"] / 1e9, 2)} for d in data]


def main():
    print("Fetching BTC price history...")
    btc = fetch_price_history("bitcoin")

    print("Fetching ETH price history...")
    eth = fetch_price_history("ethereum")

    print("Fetching market overview...")
    overview = fetch_market_overview()

    print("Fetching DeFi TVL...")
    tvl = fetch_defi_tvl()

    output = {"btc": btc, "eth": eth, "overview": overview, "defi_tvl": tvl}
    out_path = OUTPUT_DIR / "crypto.json"
    out_path.write_text(json.dumps(output, indent=2))
    print(f"Written to {out_path}")


if __name__ == "__main__":
    main()
