// staticfruit_next_starter/components/3d/NFT3DViewer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import FallbackModelViewer from './FallbackModelViewer';
import { generateLegendaryNFTModel, getModelStatus } from '@/lib/meshy';

interface NFT3DViewerProps {
  nftId: number;
  tier: string;
}

interface ModelStatus {
  status: string;
  model_urls?: {
    glb?: string;
  };
}

interface GenerateResponse {
  taskId: string;
}

export default function NFT3DViewer({ nftId, tier }: NFT3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);

        // For legendary NFTs, generate a 3D model
        if (tier === 'Legendary') {
          // Check if we already have a task ID
          const storedTaskId = localStorage.getItem(`nft-${nftId}-3d-task`);

          if (storedTaskId) {
            setTaskId(storedTaskId);
            // Check the status of the existing task
            const status = await getModelStatus(storedTaskId) as ModelStatus;
            if (status.status === 'completed' && status.model_urls?.glb) {
              setModelUrl(status.model_urls.glb);
            }
          } else {
            // Generate a new 3D model
            const response = await generateLegendaryNFTModel(nftId) as GenerateResponse;
            const newTaskId = response.taskId;
            setTaskId(newTaskId);
            localStorage.setItem(`nft-${nftId}-3d-task`, newTaskId);
          }

          // Poll for completion if we don't have a model URL yet
          if (!modelUrl && taskId) {
            const pollInterval = setInterval(async () => {
              const status = await getModelStatus(taskId) as ModelStatus;
              if (status.status === 'completed' && status.model_urls?.glb) {
                setModelUrl(status.model_urls.glb);
                clearInterval(pollInterval);
              } else if (status.status === 'failed') {
                setError('Failed to generate 3D model');
                clearInterval(pollInterval);
              }
            }, 5000); // Poll every 5 seconds
          }
        } else {
          // For non-legendary NFTs, we might not have 3D models
          setError('3D model only available for Legendary NFTs');
        }
      } catch (err) {
        setError('Failed to load 3D model');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [nftId, tier, taskId, modelUrl]);

  if (loading) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white">Loading 3D model...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="text-red-400 mb-2">Error: {error}</div>
          <div className="text-sm text-silver">
            {tier === 'Legendary'
              ? 'Legendary NFTs include exclusive 3D models'
              : '3D models are only available for Legendary NFTs'}
          </div>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="text-xl mb-2">✨ Legendary NFT</div>
          <div className="text-silver">This NFT includes an exclusive 3D model</div>
          <div className="text-sm text-accent mt-2">Model generation in progress...</div>
        </div>
      </div>
    );
  }

  return (
    <FallbackModelViewer
      modelUrl={modelUrl}
      scale={0.5}
      title={`Legendary NFT #${nftId}`}
      description="Exclusive 3D model generated with Meshy AI"
    />
  );
}