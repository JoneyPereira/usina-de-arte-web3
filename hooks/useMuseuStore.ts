import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Obra } from "@/data/obras";

export interface PreferenciasAcessibilidade {
  audiodescricaoAutomatica: boolean;
  altoContraste: boolean;
  tamanhoFonte: number;
  librasAtivoPadrao: boolean;
  preferenciasDefinidas: boolean;
}

const PREFERENCIAS_PADRAO: PreferenciasAcessibilidade = {
  audiodescricaoAutomatica: false,
  altoContraste: false,
  tamanhoFonte: 16,
  librasAtivoPadrao: false,
  preferenciasDefinidas: false,
};

interface MuseuState {
  obraProxima: Obra | null;
  obraSelecionada: Obra | null;
  setObraProxima: (obra: Obra | null) => void;
  setObraSelecionada: (obra: Obra | null) => void;
}

interface AcessibilidadeState {
  preferencias: PreferenciasAcessibilidade;
  atualizarPreferencia: <K extends keyof PreferenciasAcessibilidade>(
    chave: K,
    valor: PreferenciasAcessibilidade[K],
  ) => void;
  marcarPreferenciasDefinidas: () => void;
  resetarPreferencias: () => void;
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

export const useAcessibilidadeStore = create<AcessibilidadeState>()(
  persist(
    (set) => ({
      preferencias: PREFERENCIAS_PADRAO,
      atualizarPreferencia: (chave, valor) =>
        set((state) => ({
          preferencias: { ...state.preferencias, [chave]: valor },
        })),
      marcarPreferenciasDefinidas: () =>
        set((state) => ({
          preferencias: { ...state.preferencias, preferenciasDefinidas: true },
        })),
      resetarPreferencias: () => set({ preferencias: PREFERENCIAS_PADRAO }),
    }),
    {
      name: "usinavr-acessibilidade",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
