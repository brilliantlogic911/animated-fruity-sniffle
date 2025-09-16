// staticfruit_next_starter/components/3d/SimpleModelViewer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SimpleModelViewerProps {
  modelUrl: string;
  scale?: number;
}

export default function SimpleModelViewer({ modelUrl, scale = 1 }: SimpleModelViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Dynamically import Three.js only on the client side
    const initThree = async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js');
        
        if (!containerRef.current) return;
        
        // Clean up previous scene if it exists
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d1117);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Load OBJ model
        const loader = new OBJLoader();
        loader.load(
          modelUrl,
          (object: THREE.Object3D) => {
            // Center the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.x = -center.x;
            object.position.y = -center.y;
            object.position.z = -center.z;
            
            // Apply scale
            object.scale.set(scale, scale, scale);
            
            scene.add(object);
          },
          undefined,
          (loadError: unknown) => {
            console.error('Error loading OBJ model:', loadError);
            setError('Failed to load 3D model. Please try refreshing the page.');
          }
        );
        
        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return;
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (err) {
        console.error('Error initializing 3D viewer:', err);
        setError('Failed to initialize 3D viewer. Please try refreshing the page.');
      }
    };
    
    initThree();
  }, [modelUrl, scale]);

  if (error) {
    return (
      <div className="w-full h-96 rounded-lg bg-charcoal flex items-center justify-center">
        <div className="text-white text-center p-4">
          <div className="text-red-400 mb-2">Error: {error}</div>
          <div className="text-sm text-silver">
            3D viewer failed to load
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full bg-charcoal"
      />
      <div className="text-xs text-silver text-center mt-1">
        3D Model Viewer (Placeholder)
      </div>
    </div>
  );
}