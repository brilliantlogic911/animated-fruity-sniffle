// staticfruit_next_starter/components/3d/ModelViewer.tsx
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface ModelViewerProps {
  url: string;
  scale?: number;
}

function Model({ url, scale = 1 }: ModelViewerProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

export default function ModelViewer({ url, scale }: ModelViewerProps) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model url={url} scale={scale} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}