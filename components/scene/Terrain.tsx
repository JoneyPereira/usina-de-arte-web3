"use client";

import { useMemo } from "react";
import * as THREE from "three";

const SIZE = 400;
const SEGMENTS = 96;

export function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distanciaCentro = Math.sqrt(x * x + y * y);
      const corredor = Math.max(0, 1 - 1 / (1 + Math.pow(y / 8, 2)));
      const ondulacao =
        Math.sin(x * 0.08) * 0.6 + Math.cos(y * 0.05) * 0.5;
      const morro = Math.sin(distanciaCentro * 0.02) * 1.5;
      pos.setZ(i, (ondulacao + morro) * corredor);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#6b8e3d"
        roughness={1}
        metalness={0}
        flatShading
      />
    </mesh>
  );
}
