"use client";

import { Suspense, type ReactNode } from "react";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { DivaPrimitiva } from "@/components/scene/primitivos/DivaPrimitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

interface DivaGLTFProps extends Props {
  fallback: ReactNode;
}

function DivaGLTF({ obra, fallback }: DivaGLTFProps) {
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
      fallback={fallback}
    />
  );
}

export function ObraDiva({ obra }: Props) {
  const fallback = <DivaPrimitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <DivaGLTF obra={obra} fallback={fallback} />
      </Suspense>
    </ObraErrorBoundary>
  );
}
