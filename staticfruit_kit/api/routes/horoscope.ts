// /ai/horoscope
import { FastifyInstance } from 'fastify';
import { getTwitterTrends } from '../../collectors/twitter_collector';

export default async function routes(app: FastifyInstance) {
  app.post('/horoscope', async (req, reply) => {
    const { sign, date, favoriteArtist } = (req.body as any) ?? {};
    
    // Get current Twitter trends to incorporate into horoscope
    let twitterTrends: any[] = [];
    try {
      const trendsData = await getTwitterTrends('-7608764736147602991', 10); // US trends
      // Handle case where trendsData might be undefined or have no trends property
      if (trendsData && trendsData.trends && Array.isArray(trendsData.trends)) {
        twitterTrends = trendsData.trends.slice(0, 5); // Top 5 trends
      } else {
        throw new Error('Invalid trends data structure');
      }
    } catch (error) {
      console.error('Error fetching Twitter trends for horoscope:', error);
      // Continue with mock trends if Twitter fails
      twitterTrends = [
        { name: '#Crypto', tweet_volume: 50000 },
        { name: '#NFT', tweet_volume: 30000 },
        { name: '#Web3', tweet_volume: 25000 },
        { name: '#AI', tweet_volume: 40000 },
        { name: '#DeFi', tweet_volume: 20000 }
      ];
    }
    
    // Generate horoscope theme based on Twitter trends
    const themes = [
      'hustle', 'innovation', 'wealth', 'creativity', 'leadership',
      'transformation', 'opportunity', 'growth', 'success', 'vision'
    ];
    
    // Pick a theme based on popular trends
    let theme = 'hustle';
    if (twitterTrends.length > 0) {
      const popularTrend = twitterTrends.reduce((prev, current) =>
        (prev.tweet_volume || 0) > (current.tweet_volume || 0) ? prev : current
      );
      
      // Simple mapping of trend topics to themes
      const trendName = popularTrend.name.toLowerCase();
      if (trendName.includes('crypto') || trendName.includes('web3') || trendName.includes('defi')) {
        theme = 'wealth';
      } else if (trendName.includes('ai') || trendName.includes('tech')) {
        theme = 'innovation';
      } else if (trendName.includes('nft') || trendName.includes('art')) {
        theme = 'creativity';
      } else {
        // Pick a random theme
        theme = themes[Math.floor(Math.random() * themes.length)];
      }
    }
    
    // Generate bar based on theme and trends
    const bars = {
      'hustle': 'Move quiet, stack louder — star maps in the ledger',
      'innovation': 'Code the future, let algorithms dance to your beat',
      'wealth': 'Coins align, fortune flows where the smart money goes',
      'creativity': 'Bars bloom like NFTs, each verse a digital masterpiece',
      'leadership': 'Command the cypher, let your influence ripple through the chain',
      'transformation': 'Evolve like blockchain, each block a new beginning',
      'opportunity': 'Seize the memecoin moment, ride the viral wave',
      'growth': 'Expand like a token supply, infinite potential in every trade',
      'success': 'Victory is minted, claim your digital crown',
      'vision': 'See beyond the chart, predict the next big move'
    };
    
    // Generate vibe based on trends
    const vibes = {
      money: ['up', 'steady', 'booming', 'volatile', 'rising'][Math.floor(Math.random() * 5)],
      love: ['high', 'steady', 'blossoming', 'stable', 'thriving'][Math.floor(Math.random() * 5)],
      hustle: ['intense', 'high', 'focused', 'relentless', 'strategic'][Math.floor(Math.random() * 5)]
    };
    
    // Include top Twitter trend in the horoscope
    let trendMention = '';
    if (twitterTrends.length > 0) {
      const topTrend = twitterTrends[0].name;
      trendMention = ` The ${topTrend} energy is strong today.`;
    }
    
    const result = {
      sign,
      date,
      theme,
      bar: bars[theme as keyof typeof bars] + trendMention,
      vibe: vibes,
      twitter_trends: twitterTrends.map(t => t.name)
    };
    
    return reply.send(result);
  });
}
