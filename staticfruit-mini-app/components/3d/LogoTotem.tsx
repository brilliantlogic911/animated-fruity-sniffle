// staticfruit_next_starter/components/3d/LogoTotem.tsx
'use client';

import React, { useState, useEffect } from 'react';
import SimpleModelViewer from './SimpleModelViewer';

export default function LogoTotem() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);

        // Load the Static Fruit Logo.obj file directly
        const logoObjUrl = '/Static Fruit Logo - Edited.obj';

        // Check if the file exists by making a HEAD request
        const response = await fetch(logoObjUrl, { method: 'HEAD' });
        if (response.ok) {
          setModelUrl(logoObjUrl);
        } else {
          setError('Static Fruit Logo.obj file not found');
        }
      } catch (err) {
        setError('Failed to load Static Fruit Logo.obj file');
        console.error('Error loading logo file:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white">Loading StaticFruit Logo Totem...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="text-red-400 mb-2">Error: {error}</div>
          <div className="text-sm text-silver">
            Failed to load the StaticFruit Logo Totem 3D model
          </div>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="text-xl mb-2">StaticFruit Logo Totem</div>
          <div className="text-silver">Generating exclusive 3D model</div>
          <div className="text-sm text-accent mt-2">This may take a few moments...</div>
        </div>
      </div>
    );
  }

  return (
    <SimpleModelViewer
      modelUrl={modelUrl}
      scale={0.8}
    />
  );
}