"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

interface ModeloObraProps extends GroupProps {
  caminho: string;
  sombras?: boolean;
  customizarMesh?: (mesh: THREE.Mesh) => void;
}

export function ModeloObra({
  caminho,
  sombras = true,
  customizarMesh,
  ...props
}: ModeloObraProps) {
  const { scene } = useGLTF(caminho);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (sombras) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      customizarMesh?.(mesh);
    });
    return c;
  }, [scene, sombras, customizarMesh]);

  return (
    <group {...props}>
      <primitive object={clone} />
    </group>
  );
}
