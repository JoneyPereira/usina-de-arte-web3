"use client";

import { SoftShadows } from "@react-three/drei";

export function FachadaUsina() {
  return (
    <group position={[150, 0, -50]}>
      {/* Galpão principal */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[30, 12, 20]} />
        <meshStandardMaterial color="#8a7967" roughness={0.9} />
      </mesh>

      {/* Telhado */}
      <mesh position={[0, 13, 0]} castShadow>
        <boxGeometry args={[32, 2, 22]} />
        <meshStandardMaterial color="#4a3528" roughness={1} />
      </mesh>

      {/* Chaminé esquerda */}
      <mesh position={[-10, 14, -5]} castShadow>
        <cylinderGeometry args={[1, 1.2, 16, 12]} />
        <meshStandardMaterial color="#6b4f3a" roughness={1} />
      </mesh>

      {/* Chaminé direita */}
      <mesh position={[10, 16, -5]} castShadow>
        <cylinderGeometry args={[1.2, 1.5, 20, 12]} />
        <meshStandardMaterial color="#6b4f3a" roughness={1} />
      </mesh>

      {/* Portão de entrada */}
      <mesh position={[0, 3, 10.05]}>
        <boxGeometry args={[6, 6, 0.2]} />
        <meshStandardMaterial color="#2b1f15" roughness={1} />
      </mesh>
    </group>
  );
}

export function Iluminacao() {
  return (
    <>
      <SoftShadows size={10} samples={16} focus={0.5} />

      <ambientLight intensity={0.45} color="#ffd9a8" />

      <directionalLight
        position={[100, 60, 80]}
        intensity={1.4}
        color="#ffb060"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={400}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />

      <hemisphereLight args={["#ffd09a", "#3a4a2e", 0.35]} />

      <fog attach="fog" args={["#e8a472", 60, 320]} />
    </>
  );
}
