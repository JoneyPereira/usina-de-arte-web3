"use client";

import { VRButton } from "@react-three/xr";

export function BotaoVR() {
  return (
    <div className="fixed right-6 top-6 z-30">
      <VRButton
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 999,
          padding: "0.6rem 1.1rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {(status) =>
          status === "unsupported"
            ? "VR indisponível"
            : status === "exited"
            ? "Entrar em VR"
            : "Sair do VR"
        }
      </VRButton>
    </div>
  );
}
