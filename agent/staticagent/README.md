# StaticAgent (StaticFruit AgentKit App)

Minimal manual scaffold compatible with the &#34;npx create-agentkit-app&#34; layout, placed under `agent/staticagent`.

## Prerequisites
- Node.js 22.x (recommended to match the repo's `agent` workspace)
- PNPM or NPM (examples below use NPM)

## Install
```bash
cd agent/staticagent
npm i
```

## Configure
Copy the example env and fill required values:
```bash
cp .env.example .env
```

Required:
- `RPC_URL` – your EVM RPC endpoint (e.g. Base mainnet or testnet)
- `WALLET_PRIVATE_KEY` – the agent's EVM wallet private key (0x-prefixed)
- `X_RAPIDAPI_KEY` – your RapidAPI key for Twitter integration (required for Twitter-based market suggestions)

Optional:
- `OPENAI_API_KEY` – if you want LLM-backed flows
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` – if integrating with StaticFruit Supabase

See [`agent/staticagent/.env.example`](./.env.example).

## Scripts
- `npm run dev` – Run with live-reload using ts-node
- `npm run build` – TypeScript build to `dist/`
- `npm start` – Run compiled output from `dist/`

## Entry point
Main file: `src/index.ts`. It:
- Validates environment variables with Zod
- Prints boot log with chain id
- Lazily attempts to import `@coinbase/agentkit` (so you can install later)

Start developing your AgentKit-powered logic inside [`agent/staticagent/src/index.ts`](./src/index.ts). Example sketch (pseudo-code):
```ts
// inside src/index.ts after env load
// const kit = await agentkit.createAgentKit({
//   rpcUrl: env.RPC_URL,
//   chainId: env.CHAIN_ID,
//   privateKey: env.WALLET_PRIVATE_KEY,
// });

// TODO: Register your custom actions here (horoscopes, prediction markets, etc.)
// e.g., kit.registerAction(horoscopeAction);
// e.g., kit.registerAction(predictionMarketAction);
```

## Notes
- This scaffold is intentionally minimal and safe to extend.
- If you prefer PNPM:
  ```bash
  pnpm i
  pnpm run dev
  ```
- If `@coinbase/agentkit` is not yet available in your environment, run:
  ```bash
  npm i @coinbase/agentkit