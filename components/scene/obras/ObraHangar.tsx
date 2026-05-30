"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { HangarRufinoPrimitiva } from "@/components/scene/primitivos/HangarRufinoPrimitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

function HangarGLTF({ obra }: Props) {
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
      <spotLight
        position={[0, 6, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={2}
        color="#fff5e0"
        castShadow
      />
      <spotLight
        position={[-4, 6, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.5}
        color="#fff5e0"
        castShadow
      />
    </group>
  );
}

export function ObraHangar({ obra }: Props) {
  const fallback = <HangarRufinoPrimitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <HangarGLTF obra={obra} />
      </Suspense>
    </ObraErrorBoundary>
  );
}

useGLTF.preload("/models/hangar-rufino.glb");
