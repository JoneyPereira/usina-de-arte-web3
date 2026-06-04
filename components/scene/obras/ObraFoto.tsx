"use client";

import { Billboard, useTexture } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import type { Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";

interface Props {
  obra: Obra;
}

// Altura do pedestal (do chão até a base da foto), em metros.
const ALTURA_PEDESTAL = 0.8;

export function ObraFoto({ obra }: Props) {
  const altura = obra.alturaDisplay ?? 3;
  const largura = obra.larguraDisplay ?? 2.5;

  const textura = useTexture(obra.fotoCaminho);
  const [hovered, setHovered] = useState(false);

  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraSelecionada = useMuseuStore((s) => s.obraSelecionada);
  const destacado = obraSelecionada?.id === obra.id;

  // Cor da borda: normal = branco, hover = amarelo, destacado = laranja
  const corBorda = destacado ? "#ff8c00" : hovered ? "#ffe066" : "#ffffff";

  const handleClick = (e: THREE.Event) => {
    // @ts-expect-error - R3F injeta stopPropagation no evento
    e.stopPropagation();
    setObraSelecionada(destacado ? null : obra);
  };

  // Centro da foto fica acima do pedestal, ancorando a obra ao chão.
  const centroY = ALTURA_PEDESTAL + altura / 2;

  return (
    <group position={obra.posicao}>
      {/* Billboard: plano que sempre encara a câmera */}
      <Billboard position={[0, centroY, 0]} follow lockX={false} lockY={false} lockZ={false}>
        {/* Foto da obra */}
        <mesh
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[largura, altura]} />
          <meshBasicMaterial map={textura} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Borda decorativa (frame) — 4 barras finas ao redor da foto */}
        {(
          [
            // [posX, posY, largura, altura] — topo, base, esquerda, direita
            [0, altura / 2 + 0.03, largura + 0.06, 0.06],
            [0, -(altura / 2 + 0.03), largura + 0.06, 0.06],
            [-(largura / 2 + 0.03), 0, 0.06, altura + 0.06],
            [largura / 2 + 0.03, 0, 0.06, altura + 0.06],
          ] as const
        ).map(([px, py, w, h], i) => (
          <mesh key={i} position={[px, py, -0.01]}>
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial color={corBorda} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </Billboard>

      {/* Pedestal: cilindro fino do chão até a base do billboard */}
      <mesh position={[0, ALTURA_PEDESTAL / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, ALTURA_PEDESTAL, 6]} />
        <meshBasicMaterial color="#888888" />
      </mesh>

      {/* Sombra falsa no chão — elipse escura semi-transparente */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[largura * 0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// Pré-carregamento das fotos (chamado na zona de preload do museu)
export function precarregarFotos(caminhos: string[]) {
  caminhos.forEach((c) => useTexture.preload(c));
}
