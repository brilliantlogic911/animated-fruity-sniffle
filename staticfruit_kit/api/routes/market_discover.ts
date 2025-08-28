// /ai/market_discover
import { FastifyInstance } from 'fastify';

interface TikTokData {
  uses_24h: number;
  uses_delta_7d: number;
  creator_score: number;
  trend_velocity: number;
  engagement_rate: number;
}

interface SpotifyData {
  rank_delta_7d: number;
  playlist_adds_24h: number;
  monthly_listeners: number;
  streams_delta_7d: number;
  playlist_count: number;
}

interface NicheWeights {
  [niche: string]: number;
}

interface MarketCandidate {
  title: string;
  deadline: string;
  priorYes: number;
  rationale: string;
  niche: string;
  score: number;
  tiktokData: TikTokData;
  spotifyData: SpotifyData;
}

// Mock data generators for demonstration
function generateMockTikTokData(): TikTokData {
  return {
    uses_24h: Math.floor(Math.random() * 50000) + 1000,
    uses_delta_7d: (Math.random() - 0.5) * 200000,
    creator_score: Math.random() * 10,
    trend_velocity: Math.random() * 5,
    engagement_rate: Math.random() * 0.15
  };
}

function generateMockSpotifyData(): SpotifyData {
  return {
    rank_delta_7d: Math.floor((Math.random() - 0.5) * 100),
    playlist_adds_24h: Math.floor(Math.random() * 1000) + 10,
    monthly_listeners: Math.floor(Math.random() * 1000000) + 10000,
    streams_delta_7d: Math.floor((Math.random() - 0.5) * 1000000),
    playlist_count: Math.floor(Math.random() * 50) + 1
  };
}

// Generate candidate markets based on social media trends
function generateMarketCandidates(): MarketCandidate[] {
  const niches = [
    'mainstream_rap', 'underground_hiphop', 'dance_challenge', 'music_viral',
    'artist_collab', 'album_release', 'music_awards', 'streaming_milestone'
  ];

  const artists = [
    'Kendrick Lamar', 'Drake', 'Nicki Minaj', 'Travis Scott', 'Lil Wayne',
    'Megan Thee Stallion', 'J. Cole', 'Pusha T', 'Nas', 'Jay-Z'
  ];

  const candidates: MarketCandidate[] = [];

  // Generate 20 candidate markets
  for (let i = 0; i < 20; i++) {
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const tiktokData = generateMockTikTokData();
    const spotifyData = generateMockSpotifyData();

    let title: string;
    let deadline: string;
    let rationale: string;

    // Generate different types of markets based on niche
    switch (niche) {
      case 'mainstream_rap':
        title = `${artist} surprise collab by Oct 31?`;
        deadline = '2025-10-31';
        rationale = `${artist} showing strong social momentum with ${tiktokData.uses_24h.toLocaleString()} TikTok uses and ${spotifyData.playlist_adds_24h} playlist adds`;
        break;

      case 'underground_hiphop':
        title = `${artist} features on major label track by Dec 15?`;
        deadline = '2025-12-15';
        rationale = `Underground artist ${artist} gaining traction with ${Math.abs(spotifyData.rank_delta_7d)} rank improvement and ${tiktokData.creator_score.toFixed(1)} creator score`;
        break;

      case 'dance_challenge':
        title = `TikTok ${artist} sound hits 100k uses in 7 days?`;
        deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        rationale = `Viral potential with ${tiktokData.uses_24h.toLocaleString()} current uses and ${tiktokData.trend_velocity.toFixed(1)} trend velocity`;
        break;

      case 'music_viral':
        title = `${artist} song reaches Billboard Top 10 by Nov 30?`;
        deadline = '2025-11-30';
        rationale = `Strong streaming momentum with ${spotifyData.monthly_listeners.toLocaleString()} monthly listeners and ${spotifyData.playlist_count} playlists`;
        break;

      case 'artist_collab':
        const artist2 = artists[Math.floor(Math.random() * artists.length)];
        title = `${artist} × ${artist2} collab announced by Jan 15?`;
        deadline = '2026-01-15';
        rationale = `Both artists showing complementary social signals with combined engagement of ${(tiktokData.uses_24h + spotifyData.playlist_adds_24h).toLocaleString()}`;
        break;

      case 'album_release':
        title = `${artist} album drops in Q4 2025?`;
        deadline = '2025-12-31';
        rationale = `Artist building anticipation with ${spotifyData.streams_delta_7d > 0 ? 'increasing' : 'stable'} streams and ${tiktokData.engagement_rate.toFixed(3)} engagement rate`;
        break;

      case 'music_awards':
        title = `${artist} wins Grammy by Feb 28?`;
        deadline = '2026-02-28';
        rationale = `Award contender with ${spotifyData.rank_delta_7d > 0 ? 'rising' : 'established'} chart presence and ${tiktokData.creator_score.toFixed(1)} influence score`;
        break;

      case 'streaming_milestone':
        title = `${artist} reaches 1M monthly listeners by Dec 31?`;
        deadline = '2025-12-31';
        rationale = `Currently at ${spotifyData.monthly_listeners.toLocaleString()} listeners with ${spotifyData.streams_delta_7d > 0 ? 'upward' : 'steady'} trajectory`;
        break;

      default:
        title = `${artist} viral moment by Nov 15?`;
        deadline = '2025-11-15';
        rationale = `General viral potential with combined social metrics`;
    }

    // Calculate prior probability based on social data
    let priorYes = 0.5; // Base probability

    // TikTok factors
    if (tiktokData.uses_24h > 25000) priorYes += 0.1;
    if (tiktokData.uses_delta_7d > 50000) priorYes += 0.1;
    if (tiktokData.creator_score > 7) priorYes += 0.1;
    if (tiktokData.trend_velocity > 3) priorYes += 0.1;
    if (tiktokData.engagement_rate > 0.08) priorYes += 0.1;

    // Spotify factors
    if (spotifyData.rank_delta_7d < -10) priorYes += 0.1; // Improving rank
    if (spotifyData.playlist_adds_24h > 500) priorYes += 0.1;
    if (spotifyData.monthly_listeners > 500000) priorYes += 0.1;
    if (spotifyData.streams_delta_7d > 100000) priorYes += 0.1;
    if (spotifyData.playlist_count > 25) priorYes += 0.1;

    // Cap at 0.9
    priorYes = Math.min(priorYes, 0.9);

    candidates.push({
      title,
      deadline,
      priorYes: Math.round(priorYes * 100) / 100,
      rationale,
      niche,
      score: 0, // Will be calculated with niche weights
      tiktokData,
      spotifyData
    });
  }

  return candidates;
}

// Score and rank markets based on niche weights
function scoreAndRankMarkets(candidates: MarketCandidate[], nicheWeights: NicheWeights): MarketCandidate[] {
  // Calculate scores based on niche weights
  candidates.forEach(candidate => {
    const nicheWeight = nicheWeights[candidate.niche] || 1.0;
    const dataScore = candidate.priorYes * 100; // Convert to 0-100 scale
    candidate.score = dataScore * nicheWeight;
  });

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Return top 5 with rationale
  return candidates.slice(0, 5).map(candidate => ({
    title: candidate.title,
    deadline: candidate.deadline,
    rationale: candidate.rationale,
    priorYes: candidate.priorYes,
    niche: candidate.niche,
    score: candidate.score,
    tiktokData: candidate.tiktokData,
    spotifyData: candidate.spotifyData
  }));
}

export default async function routes(app: FastifyInstance) {
  app.post('/market_discover', async (req, reply) => {
    const { niches } = (req.body as any) ?? {};

    if (!niches || typeof niches !== 'object') {
      return reply.code(400).send({
        error: 'Missing or invalid niche weights',
        example: {
          niches: {
            'mainstream_rap': 1.5,
            'underground_hiphop': 1.2,
            'dance_challenge': 1.0
          }
        }
      });
    }

    try {
      // Generate candidate markets with mock social data
      const candidates = generateMarketCandidates();

      // Score and rank based on niche weights
      const topMarkets = scoreAndRankMarkets(candidates, niches);

      return reply.send({
        markets: topMarkets,
        total_candidates: candidates.length,
        niche_weights_applied: niches
      });

    } catch (error) {
      console.error('Market discovery error:', error);
      return reply.code(500).send({
        error: 'Internal market discovery error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
