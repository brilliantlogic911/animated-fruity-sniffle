# Meshy API Setup for StaticFruit

## Overview
This document explains how to set up the Meshy API integration for generating 3D models in the StaticFruit application.

## Prerequisites
1. Node.js 16+
2. A Meshy.ai account
3. The provided API key: `msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW`

## Setup Instructions

### 1. Environment Configuration
Add the Meshy API key to your environment variables:

For development:
```bash
# In staticfruit_kit/.env
MESHY_API_KEY=msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW
```

For production, configure the environment variable in your deployment platform.

### 2. Backend Dependencies
The required dependencies should already be installed:
- `axios` (for API requests)

### 3. Frontend Dependencies
The required dependencies should already be installed:
- `three` (3D rendering engine)
- `@react-three/fiber` (React renderer for Three.js)
- `@react-three/drei` (Useful helpers for Three.js)

### 4. API Endpoints
The following API endpoints are available:

#### Generate Logo Totem
```
POST /ai/nft-3d/logo-totem
```
Generates a 3D model of the StaticFruit logo totem.

#### Generate Legendary NFT Model
```
POST /ai/nft-3d/legendary/:nftId
```
Generates a 3D model for a specific legendary NFT.

#### Get Model Status
```
GET /ai/nft-3d/status/:taskId
```
Checks the status of a model generation task.

## How It Works

### 1. Model Generation Process
1. User requests a 3D model through the frontend
2. Frontend calls the appropriate backend API endpoint
3. Backend sends request to Meshy API
4. Meshy API returns a task ID
5. Backend stores task ID and returns it to frontend
6. Frontend polls for task completion
7. When complete, Meshy provides model URLs
8. Frontend displays the 3D model using Three.js

### 2. Caching
Model generation results are cached in localStorage to avoid regenerating models:
- Logo totem: `logo-totem-3d-task`
- NFT models: `nft-{nftId}-3d-task`

## Customization

### Modifying 3D Prompts
The 3D model prompts can be customized in:
- `staticfruit_kit/services/nft_3d_service.ts`

### Adjusting Model Display
The 3D model display can be customized in:
- `staticfruit_next_starter/components/3d/ModelViewer.tsx`
- `staticfruit_next_starter/components/3d/NFT3DViewer.tsx`
- `staticfruit_next_starter/components/3d/LogoTotem.tsx`

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify `MESHY_API_KEY` is set in environment variables
   - Check that the key has access to the required APIs

2. **Model Generation Failures**
   - Check Meshy API status
   - Verify prompts are within acceptable guidelines
   - Check rate limits

3. **3D Model Display Issues**
   - Ensure all required dependencies are installed
   - Check browser console for Three.js errors
   - Verify model URLs are accessible

### Debugging Steps

1. Check backend logs for API errors
2. Verify Meshy API key is working with curl:
   ```bash
   curl -X POST "https://api.meshy.ai/v1/text-to-3d" \
        -H "Authorization: Bearer msy_ZydFssbmSfSnBIwGh5RccYTK5h8EaSP7oOzW" \
        -H "Content-Type: application/json" \
        -d '{"prompt":"test","style":"realistic","quality":"low"}'
   ```

## Security Considerations

1. Keep API keys secure
2. Implement rate limiting to prevent abuse
3. Validate user ownership of NFTs before generating models
4. Use HTTPS for all API communications

## Performance Optimization

1. Cache generated models locally
2. Implement background job processing for model generation
3. Provide placeholder/loading states during generation
4. Optimize 3D models for web delivery

## Future Enhancements

1. Add support for other Meshy APIs (image-to-3D, texture generation)
2. Implement model refinement features
3. Add user customization options for generated models
4. Integrate with metaverse platforms