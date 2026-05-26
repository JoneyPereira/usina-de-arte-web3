"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HUD() {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisivel(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-black/60 px-5 py-3 text-sm text-neutral-100 backdrop-blur-md ring-1 ring-amber-200/20"
        >
          <p className="text-center font-medium">Como navegar</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-300">
            <span>
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">W</kbd>{" "}
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">A</kbd>{" "}
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">S</kbd>{" "}
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">D</kbd>{" "}
              mover
            </span>
            <span>Clique para olhar</span>
            <span>Clique em uma obra para detalhes</span>
            <span>
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">Esc</kbd>{" "}
              liberar mouse
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Mira() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="h-2 w-2 rounded-full bg-white/70 ring-2 ring-black/30" />
    </div>
  );
}
