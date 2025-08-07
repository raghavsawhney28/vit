import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MovingSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ mouse }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = mouse.x * Math.PI;
      sphereRef.current.rotation.x = mouse.y * Math.PI;
    }
  });

  return (
    <mesh ref={sphereRef} scale={[2.5, 2.5, 2.5]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#a78bfa" // Lavender-ish color
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
};

const SphereScene = () => {
  return (
    <div className="w-full h-screen bg-[#1e1b2e]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <MovingSphere />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default SphereScene;
