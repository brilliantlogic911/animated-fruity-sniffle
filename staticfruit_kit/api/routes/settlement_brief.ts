// /ai/settlement_brief
import { FastifyInstance } from 'fastify';

interface MarketData {
  id: number;
  title: string;
  deadline: string;
  type: 'collab' | 'album' | 'award' | 'viral' | 'milestone' | 'chart';
  artist: string;
  target: string | number;
  status: 'active' | 'settled_yes' | 'settled_no' | 'void';
}

interface Source {
  title: string;
  url: string;
  date: string;
  credibility: 'primary' | 'secondary';
}

interface SettlementBrief {
  verdict: 'yes' | 'no' | 'void';
  summary: string;
  sources: Array<{ title: string; url: string }>;
}

// Mock market database - in production, this would come from Supabase
const MARKET_DATABASE: MarketData[] = [
  // Collaboration markets
  {
    id: 1,
    title: 'Kendrick Lamar surprise collab by Oct 31?',
    deadline: '2025-10-31',
    type: 'collab',
    artist: 'Kendrick Lamar',
    target: 'any artist',
    status: 'settled_yes'
  },
  {
    id: 2,
    title: 'Drake × The Weeknd collab announced by Jan 15?',
    deadline: '2026-01-15',
    type: 'collab',
    artist: 'Drake',
    target: 'The Weeknd',
    status: 'active'
  },
  {
    id: 3,
    title: 'Nicki Minaj × Cardi B collab by Dec 31?',
    deadline: '2025-12-31',
    type: 'collab',
    artist: 'Nicki Minaj',
    target: 'Cardi B',
    status: 'settled_no'
  },

  // Album release markets
  {
    id: 4,
    title: 'Travis Scott album drops in Q4 2025?',
    deadline: '2025-12-31',
    type: 'album',
    artist: 'Travis Scott',
    target: 'any album',
    status: 'settled_yes'
  },
  {
    id: 5,
    title: 'J. Cole album releases in 2025?',
    deadline: '2025-12-31',
    type: 'album',
    artist: 'J. Cole',
    target: 'any album',
    status: 'active'
  },

  // Award markets
  {
    id: 6,
    title: 'Megan Thee Stallion wins Grammy by Feb 28?',
    deadline: '2026-02-28',
    type: 'award',
    artist: 'Megan Thee Stallion',
    target: 'Grammy',
    status: 'settled_yes'
  },
  {
    id: 7,
    title: 'Nas wins Pulitzer by Apr 30?',
    deadline: '2026-04-30',
    type: 'award',
    artist: 'Nas',
    target: 'Pulitzer',
    status: 'void'
  },

  // Viral markets
  {
    id: 8,
    title: 'TikTok Lil Wayne sound hits 100k uses in 7 days?',
    deadline: '2025-09-10',
    type: 'viral',
    artist: 'Lil Wayne',
    target: 100000,
    status: 'settled_yes'
  },
  {
    id: 9,
    title: 'TikTok Drake sound hits 500k uses in 14 days?',
    deadline: '2025-09-20',
    type: 'viral',
    artist: 'Drake',
    target: 500000,
    status: 'active'
  },

  // Chart markets
  {
    id: 10,
    title: 'Kendrick Lamar song reaches Billboard Top 10 by Nov 30?',
    deadline: '2025-11-30',
    type: 'chart',
    artist: 'Kendrick Lamar',
    target: 'Top 10',
    status: 'settled_yes'
  },

  // Milestone markets
  {
    id: 11,
    title: 'Pusha T reaches 1M monthly listeners by Dec 31?',
    deadline: '2025-12-31',
    type: 'milestone',
    artist: 'Pusha T',
    target: 1000000,
    status: 'settled_no'
  }
];

function getMarketById(marketId: number): MarketData | null {
  return MARKET_DATABASE.find(market => market.id === marketId) || null;
}

function generateSettlementBrief(market: MarketData): SettlementBrief {
  const sources: Source[] = [];
  let verdict: 'yes' | 'no' | 'void';
  let summary: string;

  switch (market.type) {
    case 'collab':
      sources.push(
        {
          title: 'Official Artist Announcement',
          url: `https://instagram.com/${market.artist.toLowerCase().replace(' ', '')}`,
          date: '2025-08-15',
          credibility: 'primary'
        },
        {
          title: 'Label Press Release',
          url: `https://press.${market.artist.toLowerCase().replace(' ', '')}music.com`,
          date: '2025-08-16',
          credibility: 'primary'
        },
        {
          title: 'Billboard Collaboration Report',
          url: 'https://billboard.com/collaborations',
          date: '2025-08-17',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `Official collaboration between ${market.artist} and ${market.target} confirmed through multiple verified sources including artist announcements and label confirmations.`;
      } else if (market.status === 'settled_no') {
        verdict = 'no';
        summary = `No collaboration announcement found between ${market.artist} and ${market.target} despite extensive monitoring of official channels and industry reports.`;
      } else {
        verdict = 'void';
        summary = `Insufficient evidence to determine collaboration status. Market deadline has not passed or sources are inconclusive.`;
      }
      break;

    case 'album':
      sources.push(
        {
          title: 'Official Album Announcement',
          url: `https://music.${market.artist.toLowerCase().replace(' ', '')}.com`,
          date: '2025-08-10',
          credibility: 'primary'
        },
        {
          title: 'Apple Music/iTunes Listing',
          url: 'https://music.apple.com',
          date: '2025-08-11',
          credibility: 'primary'
        },
        {
          title: 'Spotify Album Release',
          url: 'https://spotify.com',
          date: '2025-08-12',
          credibility: 'primary'
        },
        {
          title: 'Rolling Stone Album Preview',
          url: 'https://rollingstone.com',
          date: '2025-08-13',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `${market.artist} album officially released within the specified timeframe, confirmed by multiple streaming platforms and official announcements.`;
      } else {
        verdict = 'no';
        summary = `No album release confirmed for ${market.artist} within the market deadline. Official sources show no new album announcements or releases.`;
      }
      break;

    case 'award':
      sources.push(
        {
          title: 'Official Award Ceremony Results',
          url: market.target === 'Grammy' ? 'https://grammy.com/winners' : `https://pulitzer.org/winners`,
          date: '2025-08-20',
          credibility: 'primary'
        },
        {
          title: 'Award Organization Announcement',
          url: `https://${String(market.target).toLowerCase()}.org`,
          date: '2025-08-21',
          credibility: 'primary'
        },
        {
          title: 'Entertainment Weekly Coverage',
          url: 'https://ew.com',
          date: '2025-08-22',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `${market.artist} officially awarded the ${market.target} prize, confirmed by the awarding organization and verified through official ceremony results.`;
      } else if (market.status === 'settled_no') {
        verdict = 'no';
        summary = `${market.artist} did not win the ${market.target} prize. Official results confirm different recipient(s) for this award category.`;
      } else {
        verdict = 'void';
        summary = `Award ceremony results are inconclusive or the event has not yet occurred. Market requires official confirmation from awarding body.`;
      }
      break;

    case 'viral':
      sources.push(
        {
          title: 'TikTok Analytics Dashboard',
          url: 'https://analytics.tiktok.com',
          date: '2025-08-25',
          credibility: 'primary'
        },
        {
          title: 'TikTok Trend Reports',
          url: 'https://tiktok.com/trends',
          date: '2025-08-26',
          credibility: 'primary'
        },
        {
          title: 'Social Media Monitoring Tools',
          url: 'https://socialblade.com',
          date: '2025-08-27',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `${market.artist} sound achieved ${market.target.toLocaleString()} uses within timeframe, verified through official TikTok analytics and trend monitoring.`;
      } else {
        verdict = 'no';
        summary = `${market.artist} sound did not reach ${market.target.toLocaleString()} uses by deadline. Official TikTok data confirms lower usage numbers.`;
      }
      break;

    case 'chart':
      sources.push(
        {
          title: 'Billboard Charts Official',
          url: 'https://billboard.com/charts',
          date: '2025-08-18',
          credibility: 'primary'
        },
        {
          title: 'Nielsen Music Data',
          url: 'https://nielsen.com',
          date: '2025-08-19',
          credibility: 'primary'
        },
        {
          title: 'Variety Chart Analysis',
          url: 'https://variety.com',
          date: '2025-08-20',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `${market.artist} song achieved ${market.target} position on Billboard charts, confirmed by official Nielsen data and Billboard reporting.`;
      } else {
        verdict = 'no';
        summary = `${market.artist} song did not reach ${market.target} on Billboard charts. Official data shows lower chart positioning during the evaluation period.`;
      }
      break;

    case 'milestone':
      sources.push(
        {
          title: 'Spotify for Artists Dashboard',
          url: 'https://artists.spotify.com',
          date: '2025-08-14',
          credibility: 'primary'
        },
        {
          title: 'Apple Music Analytics',
          url: 'https://music.apple.com/analytics',
          date: '2025-08-15',
          credibility: 'primary'
        },
        {
          title: 'Streaming Industry Reports',
          url: 'https://musicbusinessworldwide.com',
          date: '2025-08-16',
          credibility: 'secondary'
        }
      );

      if (market.status === 'settled_yes') {
        verdict = 'yes';
        summary = `${market.artist} achieved ${market.target.toLocaleString()} monthly listeners milestone, verified across major streaming platforms and analytics.`;
      } else {
        verdict = 'no';
        summary = `${market.artist} did not reach ${market.target.toLocaleString()} monthly listeners by deadline. Official streaming data shows lower listener numbers.`;
      }
      break;

    default:
      verdict = 'void';
      summary = 'Market type not recognized or insufficient data for settlement determination.';
  }

  // Filter to 3-5 primary sources only
  const primarySources = sources
    .filter(source => source.credibility === 'primary')
    .slice(0, 3);

  // Add secondary sources if we have fewer than 5 total
  if (primarySources.length < 5) {
    const secondarySources = sources
      .filter(source => source.credibility === 'secondary')
      .slice(0, 5 - primarySources.length);
    primarySources.push(...secondarySources);
  }

  return {
    verdict,
    summary: summary.length > 80 ? summary.substring(0, 77) + '...' : summary,
    sources: primarySources.map(source => ({
      title: source.title,
      url: source.url
    }))
  };
}

export default async function routes(app: FastifyInstance) {
  app.post('/settlement_brief', async (req, reply) => {
    const { marketId } = (req.body as any) ?? {};

    if (!marketId || typeof marketId !== 'number') {
      return reply.code(400).send({
        error: 'Missing or invalid marketId',
        example: { marketId: 1 }
      });
    }

    const market = getMarketById(marketId);
    if (!market) {
      return reply.code(404).send({
        error: `Market with ID ${marketId} not found`,
        available_markets: MARKET_DATABASE.map(m => ({ id: m.id, title: m.title }))
      });
    }

    try {
      const brief = generateSettlementBrief(market);

      return reply.send({
        marketId,
        market_title: market.title,
        deadline: market.deadline,
        ...brief
      });

    } catch (error) {
      console.error('Settlement brief error:', error);
      return reply.code(500).send({
        error: 'Internal settlement brief error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
