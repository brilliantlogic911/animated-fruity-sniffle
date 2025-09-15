// api/routes/twitter_trends.ts
// API routes for Twitter trends integration

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TwitterMarketService } from '../../services/twitter_market_service';
import { getTwitterTrends } from '../../collectors/twitter_collector';

const twitterMarketService = new TwitterMarketService();

// Get raw Twitter trends for a location
async function getTwitterTrendsHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const { locationId = '23424977', count = '10' } = req.query as { locationId?: string; count?: string };
    const trends = await getTwitterTrends(locationId as string, parseInt(count as string));
    return trends;
  } catch (error) {
    console.error('Error fetching Twitter trends:', error);
    res.status(500).send({ error: 'Failed to fetch Twitter trends' });
  }
}

// Get Twitter trends formatted for market suggestions
async function getMarketTrendsHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const { locationId = '23424977', count = '8' } = req.query as { locationId?: string; count?: string };
    const suggestions = await twitterMarketService.generateMarketSuggestions(
      locationId as string,
      parseInt(count as string)
    );
    return { markets: suggestions };
  } catch (error) {
    console.error('Error generating market suggestions from Twitter trends:', error);
    res.status(500).send({ error: 'Failed to generate market suggestions' });
  }
}

// Get top Twitter trends for horoscope input
async function getHoroscopeTrendsHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const trendsData = await getTwitterTrends('23424977', 20);
    // Get top 5 trends by volume
    const topTrends = trendsData.trends
      .filter(trend => trend.tweet_volume !== null)
      .sort((a, b) => (b.tweet_volume || 0) - (a.tweet_volume || 0))
      .slice(0, 5);
    return { trends: topTrends };
  } catch (error) {
    console.error('Error fetching horoscope trends:', error);
    res.status(500).send({ error: 'Failed to fetch horoscope trends' });
  }
}

export default async function twitterTrends(fastify: FastifyInstance) {
  fastify.get('/twitter-trends', getTwitterTrendsHandler);
  fastify.get('/twitter-trends/markets', getMarketTrendsHandler);
  fastify.get('/twitter-trends/horoscope', getHoroscopeTrendsHandler);
}