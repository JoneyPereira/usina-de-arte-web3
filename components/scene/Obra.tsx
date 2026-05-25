"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import type { Obra as ObraType } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";

interface ObraProps {
  obra: ObraType;
}

export function Obra({ obra }: ObraProps) {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ehProxima = obraProxima?.id === obra.id;

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injects stopPropagation
    e.stopPropagation();
    setObraSelecionada(obra);
  };

  const intensidadeEmissiva = ehProxima ? 0.8 : 0.15;

  switch (obra.id) {
    case "diva":
      return (
        <Diva
          obra={obra}
          intensidade={intensidadeEmissiva}
          onClick={handleClick}
        />
      );
    case "paisagem":
      return (
        <Paisagem
          obra={obra}
          intensidade={intensidadeEmissiva}
          onClick={handleClick}
        />
      );
    case "brasil2017":
      return (
        <Brasil2017
          obra={obra}
          intensidade={intensidadeEmissiva}
          onClick={handleClick}
        />
      );
    case "hangar-rufino":
      return (
        <HangarRufino
          obra={obra}
          intensidade={intensidadeEmissiva}
          onClick={handleClick}
        />
      );
    default:
      return null;
  }
}

interface ShapeProps {
  obra: ObraType;
  intensidade: number;
  onClick: (e: THREE.Event) => void;
}

function Diva({ obra, intensidade, onClick }: ShapeProps) {
  return (
    <group position={obra.posicao}>
      <mesh
        onClick={onClick}
        rotation={[Math.PI / 2.4, 0, 0]}
        castShadow
        receiveShadow
      >
        <capsuleGeometry args={[2.8, 14, 6, 12]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

function Paisagem({ obra, intensidade, onClick }: ShapeProps) {
  const vidros = Array.from({ length: 7 }, (_, i) => i);
  return (
    <group position={obra.posicao}>
      {vidros.map((i) => (
        <mesh
          key={i}
          position={[i * 1.6 - 5, 1.5, Math.sin(i) * 0.6]}
          rotation={[0, i * 0.3, 0]}
          onClick={onClick}
          castShadow
        >
          <boxGeometry args={[1.4, 3, 0.05]} />
          <meshPhysicalMaterial
            color={obra.cor}
            emissive={obra.corEmissiva ?? obra.cor}
            emissiveIntensity={intensidade}
            transparent
            opacity={0.55}
            roughness={0.05}
            metalness={0.1}
            transmission={0.5}
            thickness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Brasil2017({ obra, intensidade, onClick }: ShapeProps) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <group position={obra.posicao}>
      <mesh
        ref={ref}
        position={[0, 2.5, 0]}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6, 5, 0.4]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.7}
        />
      </mesh>
      <Text
        position={[0, 2.5, 0.25]}
        fontSize={1.2}
        color="#f7f7f7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        BRASIL{"\n"}2017
      </Text>
    </group>
  );
}

function HangarRufino({ obra, intensidade, onClick }: ShapeProps) {
  return (
    <group position={obra.posicao}>
      {/* Estrutura externa */}
      <mesh
        position={[0, 4, 0]}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[14, 8, 10]} />
        <meshStandardMaterial
          color={obra.cor}
          emissive={obra.corEmissiva ?? obra.cor}
          emissiveIntensity={intensidade}
          roughness={0.9}
        />
      </mesh>
      {/* Telhado triangular */}
      <mesh position={[0, 9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[10, 3, 4]} />
        <meshStandardMaterial color="#3b2a1f" roughness={1} />
      </mesh>
      {/* Facão estilizado dentro */}
      <mesh position={[0, 1.5, 5.5]}>
        <boxGeometry args={[0.2, 2.5, 0.05]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}
