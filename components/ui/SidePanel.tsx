"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { BarraAcessibilidade } from "./BarraAcessibilidade";

export function SidePanel() {
  const obra = useMuseuStore((s) => s.obraSelecionada);
  const fechar = () => useMuseuStore.getState().setObraSelecionada(null);

  useEffect(() => {
    if (!obra) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [obra]);

  return (
    <AnimatePresence>
      {obra && (
        <motion.aside
          key={obra.id}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed right-0 top-0 z-40 h-full w-[min(92vw,420px)] overflow-y-auto bg-neutral-950/95 p-8 text-neutral-100 shadow-2xl ring-1 ring-amber-200/20"
        >
          <button
            onClick={fechar}
            className="absolute right-4 top-4 rounded-full bg-neutral-800/80 px-3 py-1 text-xs text-neutral-200 hover:bg-amber-500 hover:text-black"
            aria-label="Fechar painel"
          >
            Fechar ✕
          </button>

          <span
            className="inline-block h-2 w-12 rounded-full"
            style={{ backgroundColor: obra.corEmissiva ?? obra.cor }}
          />
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            {obra.titulo}
          </h2>
          <p className="mt-1 text-sm uppercase tracking-widest text-amber-300">
            {obra.artista}
          </p>

          <div
            className="mt-6 h-40 w-full rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${obra.cor}, ${
                obra.corEmissiva ?? obra.cor
              })`,
            }}
          />

          <p className="mt-6 text-base leading-relaxed text-neutral-200">
            {obra.descricao}
          </p>

          <BarraAcessibilidade obra={obra} />

          <p className="mt-8 text-xs text-neutral-500">
            Pressione <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">Esc</kbd>{" "}
            para fechar
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
