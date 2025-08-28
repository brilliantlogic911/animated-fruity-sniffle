// /ai/horoscope
import { FastifyInstance } from 'fastify';

export default async function routes(app: FastifyInstance) {
  app.post('/horoscope', async (req, reply) => {
    const { sign, date, favoriteArtist } = (req.body as any) ?? {};
    // Call your LLM here; return safe JSON
    const result = {
      sign, date,
      theme: 'hustle',
      bar: 'Move quiet, stack louder — star maps in the ledger',
      vibe: { money: 'up', love: 'steady', hustle: 'high' }
    };
    return reply.send(result);
  });
}
