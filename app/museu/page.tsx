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
import { Obra } from "@/components/scene/Obra";
import { Locomotiva } from "@/components/scene/Locomotiva";
import { useProximidade } from "@/hooks/useProximidade";
import { PainelFlutuante } from "@/components/ui/PainelFlutuante";
import { SidePanel } from "@/components/ui/SidePanel";
import { HUD, Mira } from "@/components/ui/HUD";
import { BotaoVR } from "@/components/ui/BotaoVR";

function Cena() {
  useProximidade();
  const locomotiva = obras.find((o) => o.id === "locomotiva")!;
  const demaisObras = obras.filter((o) => o.id !== "locomotiva");

  return (
    <>
      <Sky />
      <Iluminacao />
      <Terrain />
      <Vegetacao />
      <FachadaUsina />
      <Locomotiva obra={locomotiva} />
      {demaisObras.map((obra) => (
        <Obra key={obra.id} obra={obra} />
      ))}
    </>
  );
}

export default function MuseuPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ fov: 70, near: 0.1, far: 800, position: [0, 1.7, 12] }}
      >
        <XR>
          <Suspense fallback={null}>
            <Cena />
            <PlayerController />
          </Suspense>
        </XR>
      </Canvas>

      <Mira />
      <PainelFlutuante />
      <SidePanel />
      <HUD />
      <BotaoVR />
    </main>
  );
}
