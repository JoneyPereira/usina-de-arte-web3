"use client";

import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      <SSAO
        radius={0.4}
        intensity={30}
        luminanceInfluence={0.1}
        blendFunction={BlendFunction.MULTIPLY}
        worldDistanceThreshold={26}
        worldDistanceFalloff={6}
        worldProximityThreshold={0.4}
        worldProximityFalloff={0.1}
      />
      <Bloom
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={0.3}
      />
    </EffectComposer>
  );
}
