"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

export function Brasil2017Primitiva({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ehProxima = obraProxima?.id === obra.id;
  const intensidade = ehProxima ? 0.8 : 0.15;
  const ref = useRef<THREE.Mesh>(null);

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  return (
    <group position={obra.posicao}>
      <mesh
        ref={ref}
        position={[0, 2.5, 0]}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6, 5, 0.4]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.7}
        />
      </mesh>
      <Text
        position={[0, 2.5, 0.25]}
        fontSize={1.2}
        color="#f7f7f7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        BRASIL{"\n"}2017
      </Text>
    </group>
  );
}
