# StaticFruit – Next.js Mini‑App Starter (Mobile‑First)

This starter includes:
- **App Router** with **Home / Horoscope / Bars / Markets**
- **Mobile‑first UI** (Tailwind) with bottom nav and sticky CTAs
- **Manifest for Farcaster mini‑app** (`public/miniapp/manifest.json`)
- **Docs:** `docs/ARCHITECTURE.md` + `docs/prompts.md`
- **Placeholders** for contract hooks (viem/wagmi) and API calls

## Quickstart
```bash
pnpm create next-app --ts .  # or use this folder directly
pnpm i
pnpm i tailwindcss postcss autoprefixer viem wagmi zustand swr
npx tailwindcss init -p
pnpm dev
```

> Replace envs in `.env.local` and ABIs/addresses in `lib/contracts.ts`.

## Build
```bash
pnpm build && pnpm start
```

## Notes
- UI components are minimal Tailwind (shadcn‑compatible names but local implementations).
- Wire your real endpoints in `lib/api.ts` and contract addresses in `lib/contracts.ts`.
