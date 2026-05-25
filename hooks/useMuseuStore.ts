import { create } from "zustand";
import type { Obra } from "@/data/obras";

interface MuseuState {
  obraProxima: Obra | null;
  obraSelecionada: Obra | null;
  setObraProxima: (obra: Obra | null) => void;
  setObraSelecionada: (obra: Obra | null) => void;
}

export const useMuseuStore = create<MuseuState>((set) => ({
  obraProxima: null,
  obraSelecionada: null,
  setObraProxima: (obra) =>
    set((state) =>
      state.obraProxima?.id === obra?.id ? state : { obraProxima: obra },
    ),
  setObraSelecionada: (obra) => set({ obraSelecionada: obra }),
}));
