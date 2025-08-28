// api/server.ts
import Fastify from 'fastify';
import horoscope from './routes/horoscope';
import barGuard from './routes/bar_guard';
import discover from './routes/market_discover';
import settlement from './routes/settlement_brief';

const server = Fastify({ logger: true });

server.register(horoscope, { prefix: '/ai' });
server.register(barGuard, { prefix: '/ai' });
server.register(discover, { prefix: '/ai' });
server.register(settlement, { prefix: '/ai' });

server.listen({ port: Number(process.env.PORT || 8787), host: '0.0.0.0' }).then(() => {
  console.log('AI server running');
});
