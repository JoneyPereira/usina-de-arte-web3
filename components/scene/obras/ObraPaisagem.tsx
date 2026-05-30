"use client";

import { Suspense, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { PaisagemPrimitiva } from "@/components/scene/primitivos/PaisagemPrimitiva";
import { ModeloObra } from "./ModeloObra";
import { ObraErrorBoundary } from "./ObraErrorBoundary";
import * as THREE from "three";

interface Props {
  obra: Obra;
}

function customizarVidro(mesh: THREE.Mesh) {
  if (!mesh.name.toLowerCase().includes("vidro")) return;
  mesh.material = new THREE.MeshPhysicalMaterial({
    transmission: 0.92,
    roughness: 0.04,
    metalness: 0,
    ior: 1.5,
    thickness: 0.01,
    color: new THREE.Color("#d6eaf8"),
    side: THREE.DoubleSide,
  });
  mesh.castShadow = false;
}

function PaisagemGLTF({ obra }: Props) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      // @ts-expect-error - R3F injects stopPropagation
      e.stopPropagation();
      setObraSelecionada(obra);
    },
    [obra, setObraSelecionada],
  );

  return (
    <ModeloObra
      caminho={obra.modeloCaminho}
      position={obra.posicao}
      scale={obra.escala}
      onClick={handleClick}
      customizarMesh={customizarVidro}
    />
  );
}

export function ObraPaisagem({ obra }: Props) {
  const fallback = <PaisagemPrimitiva obra={obra} />;
  return (
    <ObraErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <PaisagemGLTF obra={obra} />
      </Suspense>
    </ObraErrorBoundary>
  );
}

useGLTF.preload("/models/paisagem.glb");
