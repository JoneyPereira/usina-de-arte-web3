"use client";

import { useEffect, useRef } from "react";
import { useMuseuStore, useAcessibilidadeStore } from "@/hooks/useMuseuStore";
import { useAudiodescricao } from "@/hooks/useAudiodescricao";

export function AudiodescricaoProximidade() {
  const obraProxima = useMuseuStore((s) => s.obraProxima);
  const ativa = useAcessibilidadeStore(
    (s) => s.preferencias.audiodescricaoAutomatica,
  );
  const { reproduzir, parar } = useAudiodescricao();
  const ultimaObraId = useRef<string | null>(null);

  useEffect(() => {
    if (!ativa) {
      if (ultimaObraId.current !== null) {
        parar();
        ultimaObraId.current = null;
      }
      return;
    }

    if (!obraProxima) {
      if (ultimaObraId.current !== null) {
        parar();
        ultimaObraId.current = null;
      }
      return;
    }

    if (obraProxima.id !== ultimaObraId.current) {
      ultimaObraId.current = obraProxima.id;
      reproduzir(obraProxima.acessibilidade.audiodescricaoCurta, {
        textoFallback: obraProxima.acessibilidade.textoAudiodescricaoCurta,
      });
    }
  }, [obraProxima, ativa, reproduzir, parar]);

  return null;
}
