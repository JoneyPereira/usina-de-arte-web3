"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMuseuStore } from "@/hooks/useMuseuStore";

export function PainelFlutuante() {
  const obra = useMuseuStore((s) => s.obraProxima);

  return (
    <AnimatePresence>
      {obra && (
        <motion.div
          key={obra.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed left-1/2 top-10 z-30 w-[min(90vw,520px)] -translate-x-1/2 rounded-xl border border-amber-200/40 bg-black/70 px-6 py-4 text-center text-neutral-100 backdrop-blur-md shadow-xl"
        >
          <p className="text-xs uppercase tracking-widest text-amber-300">
            Você está próximo de
          </p>
          <h2 className="mt-1 text-xl font-semibold">{obra.titulo}</h2>
          <p className="text-sm text-neutral-300">{obra.artista}</p>
          <p className="mt-2 text-xs text-neutral-400">
            Clique na obra para ver mais
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
