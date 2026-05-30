"use client";

import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

export function PaisagemPrimitiva({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ehProxima = obraProxima?.id === obra.id;
  const intensidade = ehProxima ? 0.8 : 0.15;

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  const vidros = Array.from({ length: 7 }, (_, i) => i);

  return (
    <group position={obra.posicao}>
      {vidros.map((i) => (
        <mesh
          key={i}
          position={[i * 1.6 - 5, 1.5, Math.sin(i) * 0.6]}
          rotation={[0, i * 0.3, 0]}
          onClick={handleClick}
          castShadow
        >
          <boxGeometry args={[1.4, 3, 0.05]} />
          <meshPhysicalMaterial
            color={obra.cor}
            emissive={obra.corEmissiva ?? obra.cor}
            emissiveIntensity={intensidade}
            transparent
            opacity={0.55}
            roughness={0.05}
            metalness={0.1}
            transmission={0.5}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
