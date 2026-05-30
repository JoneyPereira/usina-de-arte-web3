"use client";

import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

export function LocomotivaPrimitiva({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ehProxima = obraProxima?.id === obra.id;
  const intensidade = ehProxima ? 0.6 : 0.05;

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  return (
    <group position={obra.posicao} onClick={handleClick}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 1.6]} />
        <meshStandardMaterial color="#3a2c20" roughness={1} />
      </mesh>

      <mesh
        position={[0, 1.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1, 1, 4.5, 16]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[-2.8, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.4, 1.8]} />
        <meshStandardMaterial
          color="#3a2418"
          roughness={0.9}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade * 0.3}
        />
      </mesh>

      <mesh position={[1.5, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 1.2, 12]} />
        <meshStandardMaterial color="#2b2018" roughness={1} />
      </mesh>

      {[-1.8, -0.6, 0.6, 1.8].map((x) => (
        <mesh
          key={x}
          position={[x, 0.55, 0.85]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.55, 0.55, 0.25, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {[-1.8, -0.6, 0.6, 1.8].map((x) => (
        <mesh
          key={`l-${x}`}
          position={[x, 0.55, -0.85]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.55, 0.55, 0.25, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      <mesh position={[2.3, 1.6, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial
          color="#fff7c2"
          emissive="#fff5a0"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
