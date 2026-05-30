"use client";

import { Suspense } from "react";
import { Text, useGLTF } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { Brasil2017Primitiva } from "@/components/scene/primitivos/Brasil2017Primitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

function Brasil2017GLTF({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  return (
    <group position={obra.posicao}>
      <ModeloObra
        caminho={obra.modeloCaminho}
        scale={obra.escala}
        onClick={handleClick}
      />
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.5}
        color="#c0392b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        BRASIL 2017
      </Text>
    </group>
  );
}

export function ObraBrasil2017({ obra }: Props) {
  const fallback = <Brasil2017Primitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Brasil2017GLTF obra={obra} />
      </Suspense>
    </ObraErrorBoundary>
  );
}

useGLTF.preload("/models/brasil2017.glb");
