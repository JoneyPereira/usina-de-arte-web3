"use client";

import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

export function HangarRufinoPrimitiva({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ehProxima = obraProxima?.id === obra.id;
  const intensidade = ehProxima ? 0.8 : 0.15;

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  return (
    <group position={obra.posicao}>
      <mesh
        position={[0, 4, 0]}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[14, 8, 10]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[0, 9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[10, 3, 4]} />
        <meshStandardMaterial color="#3b2a1f" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, 5.5]}>
        <boxGeometry args={[0.2, 2.5, 0.05]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}
