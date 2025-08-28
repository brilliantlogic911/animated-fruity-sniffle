// /ai/bar_guard
import { FastifyInstance } from 'fastify';

export default async function routes(app: FastifyInstance) {
  app.post('/bar_guard', async (req, reply) => {
    const { text } = (req.body as any) ?? {};
    // TODO: plug moderation + embeddings similarity
    const toxicity = 0.12;
    const duplicateScore = 0.21;
    return reply.send({ ok: toxicity < 0.9 && duplicateScore < 0.92, toxicity, duplicateScore });
  });
}
