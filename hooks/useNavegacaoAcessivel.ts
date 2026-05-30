"use client";

import { useEffect } from "react";
import { obras } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";
import { useAudiodescricao } from "@/hooks/useAudiodescricao";

const INSTRUCOES_NAVEGACAO =
  "Use as teclas W, A, S, D para se movimentar. Clique para olhar ao redor. Pressione Tab para percorrer as obras pelo teclado, Enter para abrir o painel da obra em foco, Escape para fechar o painel e a tecla F1 para repetir estas instruções.";

export function useNavegacaoAcessivel() {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);
  const obraSelecionada = useMuseuStore((s) => s.obraSelecionada);
  const { falarComTTS } = useAudiodescricao();

  useEffect(() => {
    let indice = -1;

    const irParaProximaObra = () => {
      indice = (indice + 1) % obras.length;
      const obra = obras[indice];
      setObraSelecionada(obra);
    };

    const handler = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      const editandoCampo =
        alvo?.tagName === "INPUT" ||
        alvo?.tagName === "TEXTAREA" ||
        alvo?.isContentEditable;
      if (editandoCampo) return;

      switch (e.key) {
        case "Tab":
          if (!e.shiftKey) {
            e.preventDefault();
            irParaProximaObra();
          }
          break;
        case "Escape":
          if (obraSelecionada) setObraSelecionada(null);
          break;
        case "F1":
          e.preventDefault();
          falarComTTS(INSTRUCOES_NAVEGACAO);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setObraSelecionada, obraSelecionada, falarComTTS]);
}
