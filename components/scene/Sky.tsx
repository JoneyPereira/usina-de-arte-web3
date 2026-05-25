"use client";

import { Sky as DreiSky } from "@react-three/drei";

export function Sky() {
  return (
    <DreiSky
      distance={450000}
      sunPosition={[100, 12, 80]}
      inclination={0.49}
      azimuth={0.25}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
      rayleigh={3}
      turbidity={8}
    />
  );
}
