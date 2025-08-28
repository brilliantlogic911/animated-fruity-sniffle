#!/usr/bin/env python3
"""
StaticFruit Live Graphs
Usage examples:
  REST:
    export SF_MARKETS_URL="https://api.staticfruit.xyz/markets"
    export SF_BETS_URL="https://api.staticfruit.xyz/bets"  # supports ?marketId=
    python staticfruit_graphs_live.py --mode rest

  Postgres:
    export SF_PG_DSN="postgresql://user:pass@host:5432/db"
    python staticfruit_graphs_live.py --mode pg

  CSV:
    python staticfruit_graphs_live.py --mode csv --markets markets.csv --bets bets.csv
"""
import os, sys, argparse, datetime as dt
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages

# -----------------------------
# Args
# -----------------------------
ap = argparse.ArgumentParser()
ap.add_argument("--mode", choices=["rest","pg","csv"], required=True)
ap.add_argument("--markets", help="CSV path (csv mode)")
ap.add_argument("--bets", help="CSV path (csv mode)")
ap.add_argument("--outdir", default=".")
args = ap.parse_args()

# -----------------------------
# Data loaders
# -----------------------------
def load_rest():
    import requests
    markets_url = os.environ.get("SF_MARKETS_URL")
    bets_url = os.environ.get("SF_BETS_URL")
    if not markets_url or not bets_url:
        raise SystemExit("Set SF_MARKETS_URL and SF_BETS_URL env vars")

    # Expect markets: [{market_id, title, deadline}]
    mresp = requests.get(markets_url, timeout=30); mresp.raise_for_status()
    markets = pd.DataFrame(mresp.json())

    # Expect bets endpoint to return all bets (or you can iterate per market).
    # Bets: [{ts, market_id, user, bet_amount, outcome, odds_yes_estimate?}]
    bresp = requests.get(bets_url, timeout=60); bresp.raise_for_status()
    bets = pd.DataFrame(bresp.json())

    # type normalization
    bets["ts"] = pd.to_datetime(bets["ts"], utc=True).dt.tz_localize(None)
    if "deadline" in markets.columns:
        markets["deadline"] = pd.to_datetime(markets["deadline"], utc=True).dt.tz_localize(None)
    return markets, bets

def load_pg():
    # Requires: pip install sqlalchemy psycopg2-binary
    from sqlalchemy import create_engine, text
    dsn = os.environ.get("SF_PG_DSN")
    if not dsn:
        raise SystemExit("Set SF_PG_DSN env var, e.g., postgresql://user:pass@host:5432/db")
    eng = create_engine(dsn)
    with eng.begin() as cxn:
        markets = pd.read_sql(text(\"\"\"\
            select onchain_id as market_id, title, deadline
            from markets
            order by onchain_id
        \"\"\"), cxn)
        bets = pd.read_sql(text(\"\"\"\
            select ts, onchain_id as market_id, address as user,
                   amount as bet_amount, outcome,
                   odds_yes_estimate
            from wagers
            order by ts asc
        \"\"\"), cxn)
    bets["ts"] = pd.to_datetime(bets["ts"])
    markets["deadline"] = pd.to_datetime(markets["deadline"])
    return markets, bets

def load_csv():
    if not args.markets or not args.bets:
        raise SystemExit("--markets and --bets CSV paths required for csv mode")
    markets = pd.read_csv(args.markets)
    bets = pd.read_csv(args.bets)
    # try parse typical columns
    if "ts" in bets.columns:
        bets["ts"] = pd.to_datetime(bets["ts"])
    if "deadline" in markets.columns:
        markets["deadline"] = pd.to_datetime(markets["deadline"])
    return markets, bets

if args.mode == "rest":
    markets, bets = load_rest()
elif args.mode == "pg":
    markets, bets = load_pg()
else:
    markets, bets = load_csv()

# -----------------------------
# Expect columns:
# markets: market_id, title, deadline
# bets: ts, market_id, user, bet_amount, outcome(0/1), odds_yes_estimate(optional)
# -----------------------------
# Defensive renames
if "market_title" in markets.columns and "title" not in markets.columns:
    markets = markets.rename(columns={"market_title":"title"})
if "amount" in bets.columns and "bet_amount" not in bets.columns:
    bets = bets.rename(columns={"amount":"bet_amount"})

# Merge titles into bets for convenience
titles = markets.set_index("market_id")["title"].to_dict()
bets["market_title"] = bets["market_id"].map(titles)
bets = bets.sort_values("ts").reset_index(drop=True)
bets["date"] = bets["ts"].dt.date

# -----------------------------
# Aggregations
# -----------------------------
pool = bets.groupby(["market_id","market_title","outcome"], as_index=False)["bet_amount"].sum()
pool_yes = pool[pool["outcome"]==1][["market_id","bet_amount"]].rename(columns={"bet_amount":"pool_yes"})
pool_no  = pool[pool["outcome"]==0][["market_id","bet_amount"]].rename(columns={"bet_amount":"pool_no"})
pool_tot = pool_yes.merge(pool_no, on="market_id", how="outer").fillna(0.0)
pool_tot["market_title"] = pool_tot["market_id"].map(titles)
pool_tot["pool_total"] = pool_tot["pool_yes"] + pool_tot["pool_no"]

leaderboard = bets.groupby("user", as_index=False)["bet_amount"].sum().sort_values("bet_amount", ascending=False).head(25)

odds_series = None
if "odds_yes_estimate" in bets.columns:
    odds_series = bets.groupby(["market_id","date"], as_index=False)["odds_yes_estimate"].mean()

volume_matrix = bets.groupby(["market_id","date"], as_index=False).size().pivot(index="market_id", columns="date", values="size").fillna(0)

# Cache raw pulls
outdir = args.outdir
os.makedirs(outdir, exist_ok=True)
bets.to_csv(os.path.join(outdir,"sf_bets_cached.csv"), index=False)
markets.to_csv(os.path.join(outdir,"sf_markets_cached.csv"), index=False)
pool_tot.to_csv(os.path.join(outdir,"sf_market_pools.csv"), index=False)
leaderboard.to_csv(os.path.join(outdir,"sf_leaderboard.csv"), index=False)

# -----------------------------
# Graphs
# -----------------------------
pdf_path = os.path.join(outdir, "staticfruit_prediction_graphs.pdf")
from matplotlib.backends.backend_pdf import PdfPages
with PdfPages(pdf_path) as pdf:
    # Market pools (per market, YES vs NO)
    for _, row in pool_tot.iterrows():
        fig = plt.figure(figsize=(8,5))
        labels = ["NO","YES"]
        values = [row["pool_no"], row["pool_yes"]]
        plt.bar(labels, values)
        plt.title(f"Pool Breakdown – {str(row['market_title'])[:60]}")
        plt.ylabel("Total FRUIT Staked")
        pdf.savefig(fig, bbox_inches="tight")
        plt.close(fig)

    # Odds over time
    if odds_series is not None and not odds_series.empty:
        for mid, group in odds_series.groupby("market_id"):
            fig = plt.figure(figsize=(8,5))
            plt.plot(group["date"], group["odds_yes_estimate"], marker="o")
            plt.title(f"YES Odds Over Time – {titles.get(mid,mid)}")
            plt.ylabel("P(YES)")
            plt.ylim(0,1)
            plt.xticks(rotation=45)
            pdf.savefig(fig, bbox_inches="tight")
            plt.close(fig)

    # Bet size histogram
    fig = plt.figure(figsize=(8,5))
    plt.hist(bets["bet_amount"], bins=60)
    plt.title("Bet Size Distribution")
    plt.xlabel("FRUIT per Bet")
    plt.ylabel("Count")
    pdf.savefig(fig, bbox_inches="tight")
    plt.close(fig)

    # Leaderboard
    fig = plt.figure(figsize=(9,6))
    top = leaderboard.copy()
    top["label"] = top["user"].apply(lambda a: (a[:6] + "…" + a[-4:]) if isinstance(a,str) else str(a))
    plt.barh(top["label"], top["bet_amount"])
    plt.title("Top Bettors by Total Stake")
    plt.xlabel("Total FRUIT Staked")
    plt.gca().invert_yaxis()
    pdf.savefig(fig, bbox_inches="tight")
    plt.close(fig)

    # Heatmap
    fig = plt.figure(figsize=(10,5))
    mat = volume_matrix.values
    plt.imshow(mat, aspect="auto")
    plt.title("Bet Volume Heatmap (Markets × Days)")
    plt.xlabel("Day")
    plt.ylabel("Market ID")
    plt.yticks(ticks=np.arange(len(volume_matrix.index)), labels=volume_matrix.index)
    pdf.savefig(fig, bbox_inches="tight")
    plt.close(fig)

# Shareable PNGs
def save_png(fig, path):
    import matplotlib.pyplot as plt
    plt.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)

# Combined pool bars
import numpy as np
fig = plt.figure(figsize=(10,6))
x = np.arange(len(pool_tot))
w = 0.35
plt.bar(x - w/2, pool_tot["pool_no"], w, label="NO")
plt.bar(x + w/2, pool_tot["pool_yes"], w, label="YES")
plt.title("Market Pools – YES vs NO by Market")
plt.xlabel("Market")
plt.ylabel("Total FRUIT Staked")
labels = [ (t[:18]+"…") if isinstance(t,str) and len(t)>20 else str(t) for t in pool_tot["market_title"] ]
plt.xticks(x, labels, rotation=20, ha="right")
plt.legend()
save_png(fig, os.path.join(outdir,"sf_market_pools.png"))

# Odds multi-line (first 3 markets if available)
if odds_series is not None and not odds_series.empty:
    fig = plt.figure(figsize=(9,6))
    for i, (mid, group) in enumerate(odds_series.groupby("market_id")):
        if i >= 3: break
        plt.plot(group["date"], group["odds_yes_estimate"], marker="o", label=f"Market {mid}")
    plt.title("YES Odds Over Time – Sample Markets")
    plt.ylabel("P(YES)"); plt.ylim(0,1); plt.xticks(rotation=45); plt.legend()
    save_png(fig, os.path.join(outdir,"sf_odds_over_time.png"))

# Leaderboard PNG
fig = plt.figure(figsize=(9,6))
top = leaderboard.copy()
top["label"] = top["user"].apply(lambda a: (a[:6] + "…" + a[-4:]) if isinstance(a,str) else str(a))
plt.barh(top["label"], top["bet_amount"])
plt.title("Top Bettors by Total Stake")
plt.xlabel("Total FRUIT Staked")
plt.gca().invert_yaxis()
save_png(fig, os.path.join(outdir,"sf_leaderboard.png"))

print("Done. Wrote graphs to:", pdf_path)
