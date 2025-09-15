# Meshy API Integration for StaticFruit 3D Models

## Overview
This document describes the integration of Meshy API to generate 3D models for the StaticFruit NFT collection, specifically for the "legendary" tier and logo totem.

## Meshy API Basics

Meshy provides several APIs for 3D content generation:
1. **Text to 3D** - Generate 3D models from text prompts
2. **Image to 3D** - Generate 3D models from 2D images
3. **Texture Generation** - Create textures for 3D models
4. **Refinement** - Improve existing 3D models

## API Key
The provided API key is: `msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW`

## Implementation Plan

### 1. Meshy API Client
Create a client to interact with the Meshy API for generating 3D models of the StaticFruit logo and legendary NFTs.

### 2. Text to 3D for Logo Totem
Generate a 3D totem model based on the StaticFruit brand:
- Prompt: "Futuristic totem pole with fruit motifs, cyberpunk style, glowing neon colors"
- Style: "cyberpunk"
- Quality: "high"

### 3. Legendary NFT 3D Models
For the "legendary" tier of NFTs, generate unique 3D models:
- Prompt: "Legendary fruit artifact, glowing with magical energy, intricate details, fantasy style"
- Style: "fantasy"
- Quality: "high"

## API Endpoints

### Text to 3D
```
POST https://api.meshy.ai/v1/text-to-3d
Authorization: Bearer msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW
Content-Type: application/json

{
  "prompt": "string",
  "style": "string",
  "quality": "string"
}
```

### Get Task Status
```
GET https://api.meshy.ai/v1/text-to-3d/{task_id}
Authorization: Bearer msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW
```

## Integration with StaticFruit

### Backend Integration
1. Create API endpoints in the StaticFruit Kit API
2. Store generated model references in the database
3. Provide access control for NFT owners

### Frontend Integration
1. Display 3D models using Three.js or similar library
2. Provide controls for rotating/viewing models
3. Conditional display based on NFT ownership

## Security Considerations

1. Store API key securely in environment variables
2. Implement rate limiting to prevent abuse
3. Cache generated models to reduce API calls
4. Validate user ownership of NFTs before displaying 3D models

## Performance Considerations

1. Cache generated models locally
2. Implement background job processing for model generation
3. Provide placeholder/loading states during generation
4. Optimize 3D models for web delivery

## File Structure

```
staticfruit_kit/
├── collectors/
│   └── meshy_collector.ts          # Meshy API client
├── services/
│   └── nft_3d_service.ts           # 3D model generation service
├── api/
│   └── routes/
│       └── nft_3d.ts               # API routes for 3D models
└── lib/
    └── meshy.ts                    # Meshy API utilities

staticfruit_next_starter/
├── components/
│   └── 3d/
│       ├── ModelViewer.tsx         # 3D model viewer component
│       └── NFT3DViewer.tsx         # NFT-specific 3D viewer
├── lib/
│   └── meshy.ts                    # Frontend Meshy utilities
└── app/
    └── nft/
        └── [id]/
            └── 3d-view.tsx         # Individual NFT 3D view page
```

## Implementation Steps

### Step 1: Create Meshy Collector
Create `staticfruit_kit/collectors/meshy_collector.ts` to handle API communication.

### Step 2: Create 3D Service
Create `staticfruit_kit/services/nft_3d_service.ts` to manage model generation workflows.

### Step 3: Create API Routes
Create `staticfruit_kit/api/routes/nft_3d.ts` to expose endpoints for the frontend.

### Step 4: Create Frontend Components
Create React components for displaying 3D models in the Next.js frontend.

### Step 5: Integrate with NFT Contract
Connect the 3D model generation with the "legendary" tier of the NFT contract.

## Example Implementation

### Meshy Collector
```typescript
// staticfruit_kit/collectors/meshy_collector.ts
import axios from 'axios';

const MESHY_API_KEY = process.env.MESHY_API_KEY || 'msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW';
const MESHY_API_BASE = 'https://api.meshy.ai/v1';

export interface TextTo3DRequest {
  prompt: string;
  style: string;
  quality: string;
}

export interface TextTo3DResponse {
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

  async textTo3D(request: TextTo3DRequest): Promise<TextTo3DResponse> {
    const response = await this.axiosInstance.post('/text-to-3d', request);
    return response.data;
  }

  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const response = await this.axiosInstance.get(`/text-to-3d/${taskId}`);
    return response.data;
  }
}
```

### 3D Service
```typescript
// staticfruit_kit/services/nft_3d_service.ts
import { MeshyCollector, TextTo3DRequest } from '../collectors/meshy_collector';

export class NFT3DService {
  private meshyCollector: MeshyCollector;

  constructor() {
    this.meshyCollector = MeshyCollector.getInstance();
  }

  async generateLogoTotem(): Promise<string> {
    const request: TextTo3DRequest = {
      prompt: "Futuristic totem pole with fruit motifs, cyberpunk style, glowing neon colors",
      style: "cyberpunk",
      quality: "high"
    };

    const response = await this.meshyCollector.textTo3D(request);
    return response.task_id;
  }

  async generateLegendaryNFTModel(nftId: number): Promise<string> {
    const request: TextTo3DRequest = {
      prompt: `Legendary fruit artifact #${nftId}, glowing with magical energy, intricate details, fantasy style`,
      style: "fantasy",
      quality: "high"
    };

    const response = await this.meshyCollector.textTo3D(request);
    return response.task_id;
  }

  async getModelStatus(taskId: string) {
    return await this.meshyCollector.getTaskStatus(taskId);
  }
}
```

## Conclusion

This integration will provide a unique 3D experience for StaticFruit NFT holders, particularly those with "legendary" tier NFTs. The Meshy API allows for the generation of high-quality 3D models that can be displayed in the web application and potentially used in metaverse applications.