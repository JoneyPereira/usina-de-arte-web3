"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { LocomotivaPrimitiva } from "@/components/scene/primitivos/LocomotivaPrimitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

function LocomotivaGLTF({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  return (
    <ModeloObra
      caminho={obra.modeloCaminho}
      position={obra.posicao}
      scale={obra.escala}
      onClick={handleClick}
    />
  );
}

export function Locomotiva({ obra }: Props) {
  const fallback = <LocomotivaPrimitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LocomotivaGLTF obra={obra} />
      </Suspense>
    </ObraErrorBoundary>
  );
}

useGLTF.preload("/models/locomotiva.glb");
