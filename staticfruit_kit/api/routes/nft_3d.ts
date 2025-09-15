// /ai/nft-3d
import { FastifyInstance } from 'fastify';
import { NFT3DService } from '../../services/nft_3d_service';

const nft3dService = new NFT3DService();

export default async function routes(app: FastifyInstance) {
  app.post('/nft-3d/logo-totem', {
    schema: {
      body: { type: 'object', nullable: true }
    }
  }, async (req, reply) => {
    try {
      const taskId = await nft3dService.generateLogoTotem();
      return reply.send({ taskId });
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to generate logo totem' });
    }
  });

  app.post('/nft-3d/legendary/:nftId', async (req, reply) => {
    try {
      const { nftId } = req.params as { nftId: string };
      const taskId = await nft3dService.generateLegendaryNFTModel(parseInt(nftId));
      return reply.send({ taskId });
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to generate legendary NFT model' });
    }
  });

  app.get('/nft-3d/status/:taskId', async (req, reply) => {
    try {
      const { taskId } = req.params as { taskId: string };
      const status = await nft3dService.getModelStatus(taskId);
      return reply.send(status);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to get model status' });
    }
  });
}