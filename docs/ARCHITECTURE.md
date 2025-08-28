# ARCHITECTURE

Mobile-first PWA with chat agent distribution.

## Components
- **Web (Next.js)**: App Router, RSC, Tailwind. Routes: `/`, `/horoscope`, `/bars`, `/markets`.
- **API (Fastify)**: `/ai/*`, `/app/*`, `/og/*` (see kit).
- **On-Chain**: StaticSeeds (1155), JuiceBars (721), JuicePress, MixtapePress, FruitMarkets.
- **Indexer**: viem → Postgres (Supabase). Edge Function aggregates hourly.
- **Agent**: XMTP + Neynar for mentions. Shares mini-apps with unfurls.
- **Storage/CDN**: Supabase Storage for OG images + graphs.

## Data Flow
1. User taps CTA → writes to chain via viem/wagmi (Base).
2. Indexer listens to events → inserts to Postgres.
3. Edge Function aggregates → API serves read models.
4. Agent polls/receives webhooks → posts recaps to chats.

## Patterns
- Hexagonal, CQRS read models, domain events, Strategy for odds.
- Outbox for agent/webhook side-effects.

## Availability (CAP)
- **Chain** = CP (bets, payouts).
- **Reads** = AP (feeds). UI shows "synced Xs ago".

## Security
- UUPS + timelock + multisig. Rate limits. Moderation. Minimal PII.