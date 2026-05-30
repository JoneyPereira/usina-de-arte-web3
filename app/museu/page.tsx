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
import { Locomotiva } from "@/components/scene/obras/Locomotiva";
import { ObraDiva } from "@/components/scene/obras/ObraDiva";
import { ObraPaisagem } from "@/components/scene/obras/ObraPaisagem";
import { ObraBrasil2017 } from "@/components/scene/obras/ObraBrasil2017";
import { ObraHangar } from "@/components/scene/obras/ObraHangar";
import { Loader } from "@/components/scene/Loader";
import { PostProcessing } from "@/components/scene/PostProcessing";
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

const RENDERIZADORES_POR_ID = {
  locomotiva: Locomotiva,
  diva: ObraDiva,
  paisagem: ObraPaisagem,
  brasil2017: ObraBrasil2017,
  "hangar-rufino": ObraHangar,
} as const;

function Cena() {
  useProximidade();

  return (
    <>
      <Sky />
      <Iluminacao />
      <Terrain />
      <Vegetacao />
      <FachadaUsina />
      {obras.map((obra) => {
        const Renderizador =
          RENDERIZADORES_POR_ID[obra.id as keyof typeof RENDERIZADORES_POR_ID];
        if (!Renderizador) return null;
        return <Renderizador key={obra.id} obra={obra} />;
      })}
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
        shadows
        gl={{ antialias: true }}
        camera={{ fov: 70, near: 0.1, far: 800, position: [0, 1.7, 12] }}
        aria-hidden="true"
      >
        <XR>
          <Suspense fallback={<Loader />}>
            <Cena />
            <PlayerController />
          </Suspense>
          <PostProcessing />
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
