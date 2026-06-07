"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { XR } from "@react-three/xr";
import { obras } from "@/data/obras";
import { Sky } from "@/components/scene/Sky";
import { Terrain } from "@/components/scene/Terrain";
import { Vegetacao } from "@/components/scene/Vegetacao";
import {
  FachadaUsina,
  Iluminacao,
} from "@/components/scene/FachadaUsina";
import { PlayerController } from "@/components/scene/PlayerController";
import {
  ObraFoto,
  precarregarFotos,
} from "@/components/scene/obras/ObraFoto";
import { ObraErrorBoundary } from "@/components/scene/obras/ObraErrorBoundary";
import { Loader } from "@/components/scene/Loader";
import { useProximidade } from "@/hooks/useProximidade";
import { useNavegacaoAcessivel } from "@/hooks/useNavegacaoAcessivel";
import { PainelFlutuante } from "@/components/ui/PainelFlutuante";
import { SidePanel } from "@/components/ui/SidePanel";
import { HUD, Mira } from "@/components/ui/HUD";
import { BotaoVR } from "@/components/ui/BotaoVR";
import { PainelAcessibilidade } from "@/components/ui/PainelAcessibilidade";
import { AudiodescricaoProximidade } from "@/components/ui/AudiodescricaoProximidade";
import { ModalPreferenciasInicial } from "@/components/ui/ModalPreferenciasInicial";
import { NavegacaoAcessivel } from "@/components/ui/NavegacaoAcessivel";

// Pré-carrega as fotos das obras (custo de VRAM mínimo na G210).
precarregarFotos(obras.map((obra) => obra.fotoCaminho));

function Cena() {
  useProximidade();

  return (
    <>
      <Sky />
      <Iluminacao />
      <Terrain />
      <Vegetacao />
      <FachadaUsina />
      {obras.map((obra) => (
        <ObraErrorBoundary key={obra.id} fallback={null}>
          <Suspense fallback={null}>
            <ObraFoto obra={obra} />
          </Suspense>
        </ObraErrorBoundary>
      ))}
    </>
  );
}

function AtalhosTeclado() {
  useNavegacaoAcessivel();
  return null;
}

export default function MuseuPage() {
  return (
    <main
      role="main"
      aria-label="Museu virtual UsinaVR — percurso interativo pelo acervo da Usina de Arte"
      className="relative h-screen w-screen overflow-hidden"
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 70, near: 0.1, far: 500, position: [0, 1.7, 12] }}
        aria-hidden="true"
      >
        <XR>
          <Suspense fallback={<Loader />}>
            <Cena />
            <PlayerController />
          </Suspense>
        </XR>
      </Canvas>

      <NavegacaoAcessivel />
      <AtalhosTeclado />
      <AudiodescricaoProximidade />

      <Mira />
      <PainelFlutuante />
      <SidePanel />
      <HUD />
      <BotaoVR />
      <PainelAcessibilidade />
      <ModalPreferenciasInicial />
    </main>
  );
}
