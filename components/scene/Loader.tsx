"use client";

import { Html, useProgress } from "@react-three/drei";

export function Loader() {
  const { progress, active } = useProgress();
  if (!active && progress === 100) return null;

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white font-light tracking-wide select-none">
        <div className="text-lg">Carregando acervo</div>
        <div className="w-48 h-1 bg-white/20 rounded overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs opacity-70">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}
