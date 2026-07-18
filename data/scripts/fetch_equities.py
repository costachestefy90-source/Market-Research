"""Fetch equity data from Yahoo Finance and output JSON for the frontend."""

import json
import sys
from pathlib import Path

import yfinance as yf
import pandas as pd

OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def fetch_index_data(tickers: dict[str, str], period: str = "6mo") -> list[dict]:
    frames = {}
    for label, ticker in tickers.items():
        data = yf.download(ticker, period=period, progress=False)
        if not data.empty:
            first = data["Close"].iloc[0]
            frames[label] = (data["Close"] / first * 100).round(2)

    df = pd.DataFrame(frames).dropna()
    df.index = df.index.strftime("%Y-%m-%d")
    return [{"date": d, **row} for d, row in df.to_dict("index").items()]


def fetch_sector_performance() -> list[dict]:
    sectors = {
        "Tech": "XLK", "Health": "XLV", "Finance": "XLF",
        "Energy": "XLE", "Consumer": "XLY", "Industrial": "XLI",
        "Utilities": "XLU", "Materials": "XLB", "Real Estate": "XLRE",
    }
    results = []
    for name, ticker in sectors.items():
        data = yf.download(ticker, period="ytd", progress=False)
        if not data.empty:
            ret = ((data["Close"].iloc[-1] / data["Close"].iloc[0]) - 1) * 100
            results.append({"name": name, "return": round(float(ret.iloc[0] if hasattr(ret, 'iloc') else ret), 1)})
    return sorted(results, key=lambda x: x["return"], reverse=True)


def main():
    print("Fetching index data...")
    indices = fetch_index_data({
        "sp500": "^GSPC", "nasdaq": "^IXIC", "russell": "^RUT",
    })

    print("Fetching sector performance...")
    sectors = fetch_sector_performance()

    output = {"indices": indices, "sectors": sectors}
    out_path = OUTPUT_DIR / "equities.json"
    out_path.write_text(json.dumps(output, indent=2))
    print(f"Written to {out_path}")


if __name__ == "__main__":
    main()
