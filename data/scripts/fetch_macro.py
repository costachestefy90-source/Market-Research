"""Fetch macro data from FRED (requires free API key) and output JSON."""

import json
import os
from pathlib import Path

import pandas as pd

OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

FRED_KEY = os.environ.get("FRED_API_KEY", "")


def fetch_fred_series(series_id: str, limit: int = 60) -> list[dict]:
    if not FRED_KEY:
        print(f"  Skipping {series_id} — no FRED_API_KEY set")
        return []
    from fredapi import Fred
    fred = Fred(api_key=FRED_KEY)
    data = fred.get_series(series_id).tail(limit)
    return [
        {"date": d.strftime("%Y-%m-%d"), "value": round(float(v), 2)}
        for d, v in data.items()
        if pd.notna(v)
    ]


def main():
    series = {
        "cpi": "CPIAUCSL",
        "fed_funds": "FEDFUNDS",
        "unemployment": "UNRATE",
        "gdp": "GDP",
        "treasury_10y": "DGS10",
        "treasury_2y": "DGS2",
    }

    output = {}
    for name, sid in series.items():
        print(f"Fetching {name}...")
        output[name] = fetch_fred_series(sid)

    out_path = OUTPUT_DIR / "macro.json"
    out_path.write_text(json.dumps(output, indent=2))
    print(f"Written to {out_path}")


if __name__ == "__main__":
    main()
