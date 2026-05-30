"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { DivaPrimitiva } from "@/components/scene/primitivos/DivaPrimitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

function DivaGLTF({ obra }: Props) {
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

export function ObraDiva({ obra }: Props) {
  const fallback = <DivaPrimitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <DivaGLTF obra={obra} />
      </Suspense>
    </ObraErrorBoundary>
  );
}

useGLTF.preload("/models/diva.glb");
