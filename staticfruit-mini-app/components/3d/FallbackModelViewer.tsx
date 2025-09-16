// staticfruit_next_starter/components/3d/FallbackModelViewer.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface FallbackModelViewerProps {
  modelUrl: string;
  scale?: number;
  title?: string;
  description?: string;
}

interface FileInfo {
  size: string;
  type: string;
}

export default function FallbackModelViewer({
  modelUrl,
  scale = 1,
  title = "3D Model",
  description = "Generated with Meshy AI"
}: FallbackModelViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    const getFileInfo = async () => {
      try {
        const response = await fetch(modelUrl, { method: 'HEAD' });
        if (response.ok) {
          const contentLength = response.headers.get('content-length');
          const contentType = response.headers.get('content-type') || 'application/octet-stream';

          setFileInfo({
            size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : 'Unknown',
            type: contentType
          });
        }
      } catch (error) {
        console.error('Error getting file info:', error);
      }
    };

    if (modelUrl) {
      getFileInfo();
    }
  }, [modelUrl]);

  const handleViewModel = () => {
    setIsLoading(true);
    // Create a simple viewer for the OBJ model
    const viewerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>3D Model Viewer</title>
        <style>
          body { margin: 0; overflow: hidden; }
          #container { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="container"></div>
        <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/OBJLoader.js"></script>
        <script>
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.getElementById('container').appendChild(renderer.domElement);
          
          // Add lights
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          
          // Load model
          const loader = new THREE.OBJLoader();
          loader.load('${modelUrl}', function(object) {
            scene.add(object);
            
            // Center the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.x = -center.x;
            object.position.y = -center.y;
            object.position.z = -center.z;
          });
          
          camera.position.z = 5;
          
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          
          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          
          animate();
          
          window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
        </script>
      </body>
      </html>
    `;
    
    // Open the viewer in a new tab
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(viewerHtml);
      newWindow.document.close();
    }
    
    setIsLoading(false);
  };

  const handleDownloadModel = () => {
    const link = document.createElement('a');
    link.href = modelUrl;
    link.download = title.replace(/\s+/g, '_') + '.obj';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-96 rounded-lg bg-gradient-to-br from-charcoal to-gray-800 flex flex-col items-center justify-center p-6">
      {/* Animated placeholder */}
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-lg opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-neon to-gold rounded-lg opacity-10 animate-ping"></div>
        <div className="absolute inset-2 w-28 h-28 bg-charcoal rounded-lg flex items-center justify-center">
          <div className="text-4xl">🎨</div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-silver mb-4">{description}</p>
        <div className="text-xs text-accent">
          ✨ Generated with Meshy AI
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleViewModel}
          disabled={isLoading}
          className="px-4 py-2 bg-primary hover:bg-neon text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Loading...' : 'View Model'}
        </button>
        <button
          onClick={handleDownloadModel}
          className="px-4 py-2 bg-accent hover:bg-gold text-space font-bold rounded-lg transition-colors duration-200 text-sm"
        >
          Download .obj
        </button>
      </div>

      {/* Model info */}
      <div className="mt-4 text-xs text-silver text-center">
        <div>Scale: {scale}x</div>
        {fileInfo && (
          <div className="mt-1">
            <div>File Size: {fileInfo.size}</div>
            <div>Type: {fileInfo.type}</div>
          </div>
        )}
        <div className="mt-1 opacity-75">
          File: Static Fruit Logo.obj
        </div>
      </div>
    </div>
  );
}