"use client";

import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import { obras } from "@/data/obras";

interface ArvoreData {
  position: [number, number, number];
  scale: number;
  rotation: number;
}

function gerarArvores(quantidade: number): ArvoreData[] {
  const arvores: ArvoreData[] = [];
  const seed = 1337;
  const rand = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  let i = 0;
  while (arvores.length < quantidade && i < quantidade * 8) {
    const x = (rand(i * 2) - 0.5) * 280;
    const z = (rand(i * 2 + 1) - 0.5) * 280;
    i++;

    if (Math.abs(z) < 7 && x > -10 && x < 130) continue;
    const conflito = obras.some((o) => {
      const dx = o.posicao[0] - x;
      const dz = o.posicao[2] - z;
      return Math.sqrt(dx * dx + dz * dz) < (o.raioProximidade + 4);
    });
    if (conflito) continue;

    arvores.push({
      position: [x, 0, z],
      scale: 0.8 + rand(i * 3) * 0.8,
      rotation: rand(i * 4) * Math.PI * 2,
    });
  }
  return arvores;
}

export function Vegetacao() {
  const troncos = useMemo(() => gerarArvores(80), []);

  return (
    <>
      <Instances limit={troncos.length} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#4a2f1a" roughness={1} flatShading />
        {troncos.map((arv, idx) => (
          <Instance
            key={`tronco-${idx}`}
            position={[arv.position[0], 1, arv.position[2]]}
            scale={arv.scale}
            rotation={[0, arv.rotation, 0]}
          />
        ))}
      </Instances>

      <Instances limit={troncos.length} castShadow>
        <coneGeometry args={[1.6, 4, 6]} />
        <meshStandardMaterial color="#2f5d34" roughness={1} flatShading />
        {troncos.map((arv, idx) => (
          <Instance
            key={`copa-${idx}`}
            position={[arv.position[0], 4 * arv.scale, arv.position[2]]}
            scale={arv.scale}
            rotation={[0, arv.rotation, 0]}
          />
        ))}
      </Instances>
    </>
  );
}
