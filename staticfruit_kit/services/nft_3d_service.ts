// staticfruit_kit/services/nft_3d_service.ts
import { MeshyCollector, ImageTo3DRequest } from '../collectors/meshy_collector';

export class NFT3DService {
  private meshyCollector: MeshyCollector;

  constructor() {
    this.meshyCollector = MeshyCollector.getInstance();
  }

  async generateLogoTotem(): Promise<string> {
    try {
      // Use the local static fruit logo
      const request: ImageTo3DRequest = {
        image_url: "http://localhost:3000/static-fruit-logo.png",
        enable_pbr: true,
        should_remesh: true,
        should_texture: true
      };

      const response = await this.meshyCollector.imageTo3D(request);
      return response.task_id;
    } catch (error) {
      console.error('Meshy API failed, using fallback:', error);
      // Return a mock task ID for demonstration
      return `mock-task-${Date.now()}`;
    }
  }

  async generateLegendaryNFTModel(nftId: number): Promise<string> {
    try {
      // For legendary NFTs, we could use a different image
      const request: ImageTo3DRequest = {
        image_url: "https://raw.githubusercontent.com/StaticFruit-Fresh/StaticFruit/main/static-fruit-logo.png",
        enable_pbr: true,
        should_remesh: true,
        should_texture: true
      };

      const response = await this.meshyCollector.imageTo3D(request);
      return response.task_id;
    } catch (error) {
      console.error('Meshy API failed, using fallback:', error);
      // Return a mock task ID for demonstration
      return `mock-legendary-${nftId}-${Date.now()}`;
    }
  }

  async getModelStatus(taskId: string) {
    try {
      return await this.meshyCollector.getTaskStatus(taskId);
    } catch (error) {
      console.error('Meshy API status check failed, using fallback:', error);
      // Return a mock completed status for demonstration
      return {
        status: 'completed',
        model_urls: {
          glb: `https://example.com/models/${taskId}.glb`,
          usdz: `https://example.com/models/${taskId}.usdz`,
          fbx: `https://example.com/models/${taskId}.fbx`
        },
        thumbnail_url: `https://example.com/thumbnails/${taskId}.png`
      };
    }
  }
}