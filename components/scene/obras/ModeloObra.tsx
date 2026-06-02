"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

interface ModeloObraProps extends GroupProps {
  caminho: string;
  sombras?: boolean;
  customizarMesh?: (mesh: THREE.Mesh) => void;
  fallback?: ReactNode;
}

export function ModeloObra({
  caminho,
  sombras = true,
  customizarMesh,
  fallback = null,
  ...props
}: ModeloObraProps) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setErro(false);
    setScene(null);

    import("three/examples/jsm/loaders/GLTFLoader")
      .then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        loader.load(
          caminho,
          (gltf: { scene: THREE.Group }) => {
            if (!isMounted) return;
            setScene(gltf.scene);
          },
          undefined,
          () => {
            if (!isMounted) return;
            setErro(true);
          },
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setErro(true);
      });

    return () => {
      isMounted = false;
    };
  }, [caminho]);

  const clone = useMemo(() => {
    if (!scene) return null;

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

  if (!scene || erro) return <>{fallback}</>;

  return (
    <group {...props}>
      <primitive object={clone!} />
    </group>
  );
}
