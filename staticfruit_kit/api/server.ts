// api/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import horoscope from './routes/horoscope';
import barGuard from './routes/bar_guard';
import discover from './routes/market_discover';
import settlement from './routes/settlement_brief';
import nft3d from './routes/nft_3d';
import twitterTrends from './routes/twitter_trends';
import graphs from './routes/graphs';

// Load environment variables
dotenv.config();

const server = Fastify({ logger: true });

// Register CORS
server.register(cors, {
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Health check endpoint
server.get('/health', async (req, reply) => {
  return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

server.register(horoscope, { prefix: '/ai' });
server.register(barGuard, { prefix: '/ai' });
server.register(discover, { prefix: '/ai' });
server.register(settlement, { prefix: '/ai' });
server.register(nft3d, { prefix: '/ai' });
server.register(twitterTrends, { prefix: '/ai' });
server.register(graphs);

server.listen({ port: Number(process.env.PORT || 8787), host: '0.0.0.0' }).then(() => {
  console.log('AI server running on port', process.env.PORT || 8787);
});
