# StaticFruit Live Graphs (Plug‑and‑Play)

This script generates **the same crazy graphs** from your **real markets + bets**.

## Three ways to feed data

### 1) REST (recommended)
Expose two endpoints from your indexer/Next API:
- `GET /api/markets` → `[{"market_id":1,"title":"…","deadline":"2025-09-20T00:00:00Z"}, …]`
- `GET /api/bets` → `[{"ts":"2025-08-28T14:03:00Z","market_id":1,"user":"0x…","bet_amount":42.5,"outcome":1,"odds_yes_estimate":0.61}, …]`

Then run:
```bash
export SF_MARKETS_URL="https://api.staticfruit.xyz/markets"
export SF_BETS_URL="https://api.staticfruit.xyz/bets"
python staticfruit_graphs_live.py --mode rest --outdir out
```

### 2) Postgres / Supabase
Match (or adapt) these tables:
```sql
-- markets
onchain_id bigint primary key,
title text not null,
deadline timestamptz not null

-- wagers
ts timestamptz not null,
onchain_id bigint not null references markets(onchain_id),
address text not null,
amount numeric not null,
outcome smallint not null, -- 0 = NO, 1 = YES
odds_yes_estimate numeric
```
Run:
```bash
export SF_PG_DSN="postgresql://user:pass@host:5432/db"
python staticfruit_graphs_live.py --mode pg --outdir out
```

### 3) CSV
Provide two CSV files with the same columns:
```bash
python staticfruit_graphs_live.py --mode csv --markets markets.csv --bets bets.csv --outdir out
```

## Outputs
- `staticfruit_prediction_graphs.pdf`
- `sf_market_pools.png`, `sf_odds_over_time.png`, `sf_leaderboard.png`
- Cached: `sf_bets_cached.csv`, `sf_markets_cached.csv`, `sf_market_pools.csv`, `sf_leaderboard.csv`

## Tip: Quick Next.js/viem indexer for Bets
```ts
// /pages/api/bets.ts
import { createPublicClient, http, decodeEventLog } from 'viem';
import { base } from 'viem/chains';
import FruitMarketsABI from '@/abi/FruitMarkets.json';

const client = createPublicClient({ chain: base, transport: http(process.env.ALCHEMY_URL!) });
const CONTRACT = process.env.MARKETS_ADDR as `0x${string}`;

// Pull BetPlaced events and map to rows
export default async function handler(req, res) {
  const fromBlock = BigInt(process.env.FROM_BLOCK || '0');
  const toBlock = 'latest';
  const logs = await client.getLogs({ address: CONTRACT, fromBlock, toBlock });
  const rows = logs.flatMap((l) => {
    try {
      const { eventName, args } = decodeEventLog({ abi: FruitMarketsABI, ...l });
      if (eventName !== 'BetPlaced') return [];
      return [{
        ts: new Date(Number(l.blockTimestamp || Date.now())).toISOString(),
        market_id: Number(args.id),
        user: args.user,
        bet_amount: Number(args.amount) / 1e18,
        outcome: Number(args.outcome),
        odds_yes_estimate: null
      }];
    } catch { return []; }
  });
  res.json(rows);
}
```

Now your graphs stay live with onchain events.
