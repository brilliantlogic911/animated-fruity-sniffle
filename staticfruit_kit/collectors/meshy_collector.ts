// staticfruit_kit/collectors/meshy_collector.ts
import axios from 'axios';

const MESHY_API_KEY = process.env.MESHY_API_KEY || 'msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW';
const MESHY_API_BASE = 'https://api.meshy.ai/openapi/v1';

export interface ImageTo3DRequest {
  image_url: string;
  enable_pbr: boolean;
  should_remesh: boolean;
  should_texture: boolean;
}

export interface ImageTo3DResponse {
  task_id: string;
}

export interface TaskStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  model_urls?: {
    glb: string;
    usdz: string;
    fbx: string;
  };
  thumbnail_url?: string;
}

export class MeshyCollector {
  private static instance: MeshyCollector;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: MESHY_API_BASE,
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static getInstance(): MeshyCollector {
    if (!MeshyCollector.instance) {
      MeshyCollector.instance = new MeshyCollector();
    }
    return MeshyCollector.instance;
  }

  async imageTo3D(request: ImageTo3DRequest): Promise<ImageTo3DResponse> {
    try {
      console.log('Making Meshy API request:', request);
      // Use the correct Meshy API endpoint for image-to-3d
      const response = await this.axiosInstance.post('/image-to-3d', request);
      console.log('Meshy API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Meshy API error:', error.response?.data || error.message);
      throw new Error(`Meshy API request failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    try {
      console.log('Checking task status for:', taskId);
      // Use the correct Meshy API endpoint for task status
      const response = await this.axiosInstance.get(`/image-to-3d/${taskId}`);
      console.log('Task status response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Meshy API status error:', error.response?.data || error.message);
      throw new Error(`Meshy API status check failed: ${error.response?.data?.message || error.message}`);
    }
  }
}