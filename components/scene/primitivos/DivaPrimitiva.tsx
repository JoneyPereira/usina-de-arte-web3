"use client";

import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

export function DivaPrimitiva({ obra }: Props) {
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
        onClick={handleClick}
        rotation={[Math.PI / 2.4, 0, 0]}
        castShadow
        receiveShadow
      >
        <capsuleGeometry args={[2.8, 14, 6, 12]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
