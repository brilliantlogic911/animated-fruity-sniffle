// StaticAgent entrypoint: registers StaticFruit actions and wires to API

import 'dotenv/config';
import { z } from 'zod';
import { Agent } from './agent';

const EnvSchema = z.object({
  RPC_URL: z.string().min(1, 'RPC_URL is required'),
  CHAIN_ID: z.coerce.number().default(8453),
  WALLET_PRIVATE_KEY: z.string().min(1, 'WALLET_PRIVATE_KEY is required'),
  LOG_LEVEL: z.string().default('info'),
  OPENAI_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  API: z.string().optional(), // Base URL for staticfruit_kit API (defaults to http://localhost:8787)
  API_BASE: z.string().optional(),
  STATICFRUIT_API: z.string().optional(),
});

interface Env {
  RPC_URL: string;
  CHAIN_ID: number;
  WALLET_PRIVATE_KEY: string;
  LOG_LEVEL?: string;
  OPENAI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  API?: string;
  API_BASE?: string;
  STATICFRUIT_API?: string;
}

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid or missing environment variables:');
    for (const issue of parsed.error.issues) {
      console.error(` - ${issue.path.join('.')}: ${issue.message}`);
    }
    console.error('Create a .env from .env.example and fill in required values.');
    process.exit(1);
  }
  return parsed.data;
}

function getApiBase(): string {
  return (
    process.env.API ||
    process.env.API_BASE ||
    process.env.STATICFRUIT_API ||
    'http://localhost:8787'
  ).replace(/\/+$/, '');
}

async function lazyImportAgentKit() {
  try {
    const mod = await import('@coinbase/agentkit');
    return mod;
  } catch {
    // Optional dependency; fine if not present yet
    return null;
  }
}

function registerActions(agent: Agent, API: string) {
  // 1) generateHoroscope
  agent.addAction({
    name: 'generateHoroscope',
    description: "Generate today's hip-hop horoscope for a sign",
    parameters: { sign: 'string', date: 'string' },
    handler: async (args: { sign: string; date: string }) => {
      const { sign, date } = args;
      const res = await fetch(`${API}/ai/horoscope`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sign, date }),
      });
      if (!res.ok) throw new Error(`horoscope failed: ${res.status}`);
      return await res.json(); // { theme, bar, vibe }
    },
  });

  // 2) punchUpBar
  agent.addAction({
    name: 'punchUpBar',
    description: 'AI-enhance a bar (rap line)',
    parameters: { text: 'string', style: 'string' },
    handler: async (args: { text: string; style: string }) => {
      const { text, style } = args;
      const res = await fetch(`${API}/ai/bar_guard`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });
      if (!res.ok) throw new Error(`bar_guard failed: ${res.status}`);
      return await res.json(); // { ok, suggestions? | reasons | toxicity }
    },
  });

  // 3) createPredictionMarket
  agent.addAction({
    name: 'createPredictionMarket',
    description: 'Open a new pop culture prediction market',
    parameters: { topic: 'string', deadline: 'string' },
    handler: async (args: { topic: string; deadline: string }) => {
      const { topic, deadline } = args;
      const res = await fetch(`${API}/markets`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic, deadline }),
      });
      if (!res.ok) throw new Error(`create market failed: ${res.status}`);
      return await res.json(); // { marketId, url }
    },
  });

  // 4) suggestMarkets
  agent.addAction({
    name: 'suggestMarkets',
    description: 'Suggest trending pop culture markets based on Twitter trends',
    parameters: { location: 'string' },
    handler: async (args: { location?: string }) => {
      // Import our Twitter market service
      const { TwitterMarketService } = await import('./services/twitter_market_service');
      const twitterService = new TwitterMarketService();
      
      // Default to US trends, but allow location override
            // Using place IDs instead of WOEIDs for the new Twitter API
            const locationId = args.location === 'global' ? '1' :
                              args.location === 'nyc' ? '2459115' :
                              args.location === 'la' ? '2442047' :
                              args.location === 'miami' ? '2450022' :
                              args.location === 'dallas' ? '2388929' :
                              args.location === 'detroit' ? '2391585' : '-7608764736147602991'; // US default (place ID)
      
      // Get Twitter-based market suggestions
      const twitterSuggestions = await twitterService.generateMarketSuggestions(locationId);
      
      // If we have Twitter suggestions, use them
      if (twitterSuggestions.length > 0) {
        // Convert to the expected format
        const markets = twitterSuggestions.map(suggestion => ({
          title: suggestion.title,
          deadline: suggestion.deadline,
          priorYes: 0.5, // Neutral odds to start
          category: suggestion.category,
          twitter_volume: suggestion.volume
        }));
        
        return { markets, source: 'twitter_trends' };
      }
      
      // Fallback to original AI-based discovery
      const niches = {
        mainstream_rap: 1.3,
        underground_hiphop: 1.0,
        dance_challenge: 1.1,
        music_viral: 1.2,
        artist_collab: 1.25,
        album_release: 1.15,
        music_awards: 0.9,
        streaming_milestone: 1.0,
      };
      const res = await fetch(`${API}/ai/market_discover`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ niches }),
      });
      if (!res.ok) throw new Error(`market_discover failed: ${res.status}`);
      // { markets: [{title, deadline, priorYes, ...}], total_candidates, niche_weights_applied }
      const aiMarkets = await res.json();
      
      // Enhance with Twitter data if available
      const enhancedMarkets = await twitterService.enhanceMarketSuggestions(aiMarkets.markets || aiMarkets);
      
      return { markets: enhancedMarkets, source: 'ai_enhanced' };
    },
  });

  // 5) placeBet
  agent.addAction({
    name: 'placeBet',
    description: 'Place a bet on a market outcome',
    parameters: { marketId: 'string', outcome: 'string', amount: 'number' },
    handler: async (args: { marketId: string; outcome: string; amount: number }) => {
      const { marketId, outcome, amount } = args;
      const res = await fetch(`${API}/bets`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ marketId, outcome, amount }),
      });
      if (!res.ok) throw new Error(`place bet failed: ${res.status}`);
      return await res.json(); // { txHash, success }
    },
  });

  // 6) shareGraphs
  agent.addAction({
    name: 'shareGraphs',
    description: 'Share graphs for a market (pools, odds, leaderboard)',
    parameters: { marketId: 'string' },
    handler: async (args: { marketId: string }) => {
      const { marketId } = args;
      const res = await fetch(`${API}/graphs/${marketId}`, { method: 'GET' });
      if (!res.ok) throw new Error(`share graphs failed: ${res.status}`);
      return await res.json(); // { urls: { pools, odds, leaderboard } }
    },
  });

  // 7) announceWinners
  agent.addAction({
    name: 'announceWinners',
    description: 'Announce market settlement winners',
    parameters: { marketId: 'string' },
    handler: async (args: { marketId: string }) => {
      const { marketId } = args;
      const idNum = typeof marketId === 'string' ? Number(marketId) : marketId;
      const res = await fetch(`${API}/ai/settlement_brief`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ marketId: idNum }),
      });
      if (!res.ok) throw new Error(`settlement_brief failed: ${res.status}`);
      const brief = await res.json();
      return `🏆 Market #${idNum} settled: ${String(brief.verdict).toUpperCase()} — ${brief.summary}`;
    },
  });
}

async function main() {
  const env = loadEnv();
  const API = getApiBase();

  console.log(`[staticagent] API=${API}, CHAIN_ID=${env.CHAIN_ID}`);

  const agentkit = await lazyImportAgentKit();
  if (agentkit) {
    console.log('[staticagent] AgentKit detected. You can wire on-chain actions as needed.');
    // Example:
    // const kit = await agentkit.createAgentKit({
    //   rpcUrl: env.RPC_URL,
    //   chainId: env.CHAIN_ID,
    //   privateKey: env.WALLET_PRIVATE_KEY,
    // });
    // Attach kit-backed actions here if desired.
  }

  const agent = new Agent();
  registerActions(agent, API);

  console.log('[staticagent] Actions ready:', agent.listActions().join(', '));
  console.log('[staticagent] Scaffold ready. Integrate intents to call agent.runAction(name, params).');
}

main().catch((err) => {
  console.error('[staticagent] Fatal error:', err);
  process.exit(1);
});