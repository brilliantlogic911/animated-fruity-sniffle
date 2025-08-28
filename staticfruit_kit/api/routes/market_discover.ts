// /ai/market_discover
import { FastifyInstance } from 'fastify';

export default async function routes(app: FastifyInstance) {
  app.post('/market_discover', async (req, reply) => {
    const { niches } = (req.body as any) ?? {};
    // Stub: replace with TikTok/Spotify enrichers
    const candidates = [
      { title: 'Nicki surprise collab by Oct 31?', deadline: '2025-10-31', priorYes: 0.62, niche: 'mainstream_rap' },
      { title: 'TikTok sound X hits 100k uses in 7 days?', deadline: '2025-09-10', priorYes: 0.44, niche: 'dance_challenge' }
    ];
    return reply.send({ candidates });
  });
}
