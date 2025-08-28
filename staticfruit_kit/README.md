# StaticFruit Kit – Mini Apps + Agents + Graphs + AI + Cron

This kit packages:
- **Supabase Edge Function** to aggregate markets/bets hourly
- **GitHub Actions Cron** that generates **graphs** and uploads to **Supabase Storage**
- **AI endpoints** for Horoscope, Bars moderation, Market discovery & settlement briefs
- **TikTok/Spotify collectors** (stubs) to enrich prediction signals
- **Creator niches taxonomy** for market discovery weighting
- **Graphs toolkit** (PDF/PNGs) you already tested

## Quick Start

1) Copy `.env.template` to `.env` and fill values.
2) Deploy Supabase Edge Function:
```bash
cd supabase
supabase functions deploy sf_aggregate
# schedule via dashboard (recommended) or let GitHub Actions run hourly aggregation
```
3) Enable GitHub Actions in your repo and commit `.github/workflows/graphs-cron.yml`.
4) Add the following repo secrets:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `SUPABASE_STORAGE_BUCKET`
   - `ALCHEMY_URL`, `MARKETS_ADDR`
5) The cron will run hourly, build graphs from live data, and upload images to Supabase Storage.

For TikTok/Spotify enrichers, pick one provider (RapidAPI, Apify) and set API keys in `.env`.
