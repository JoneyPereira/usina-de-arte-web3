"use client";

import { useState } from "react";
import type { Obra } from "@/data/obras";
import { useAudiodescricao } from "@/hooks/useAudiodescricao";
import { useVLibras } from "@/hooks/useVLibras";

interface Props {
  obra: Obra;
}

export function BarraAcessibilidade({ obra }: Props) {
  const { reproduzir, parar, tocando } = useAudiodescricao();
  const { traduzir, disponivel: librasDisponivel } = useVLibras();
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);

  const ouvirCurta = () =>
    reproduzir(obra.acessibilidade.audiodescricaoCurta, {
      textoFallback: obra.acessibilidade.textoAudiodescricaoCurta,
    });

  const [librasAtivada, setLibrasAtivada] = useState(false);

  const ouvirLonga = () => {
    setDescricaoExpandida(true);
    reproduzir(obra.acessibilidade.audiodescricaoLonga, {
      textoFallback: obra.acessibilidade.textoAudiodescricaoLonga,
    });
  };

  const acionarLibras = () => {
    setLibrasAtivada(true);
    traduzir(obra.acessibilidade.textoLibras);
  };

  return (
    <section
      role="complementary"
      aria-label="Recursos de acessibilidade desta obra"
      className="mt-8 rounded-lg border border-amber-200/20 bg-black/40 p-4"
    >
      <p className="text-xs uppercase tracking-widest text-amber-300">
        Acessibilidade
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={ouvirCurta}
          aria-label="Ouvir audiodescrição curta desta obra"
          className="rounded-full bg-amber-500/90 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-amber-400"
        >
          {tocando ? "🔊 Tocando..." : "🔊 Audiodescrição"}
        </button>

        <button
          type="button"
          onClick={ouvirLonga}
          aria-expanded={descricaoExpandida}
          aria-label="Ouvir audiodescrição detalhada desta obra"
          className="rounded-full border border-amber-300/50 bg-transparent px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-300/10"
        >
          📖 Descrição detalhada
        </button>

        <button
          type="button"
          onClick={parar}
          aria-label="Parar reprodução de áudio"
          className="rounded-full border border-neutral-600 bg-transparent px-3 py-1.5 text-xs text-neutral-300 transition hover:bg-neutral-800"
        >
          ⏹ Parar
        </button>

        <button
          type="button"
          onClick={acionarLibras}
          disabled={!librasDisponivel}
          aria-label="Traduzir descrição para LIBRAS"
          className="rounded-full border border-blue-300/50 bg-transparent px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-300/10 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            librasDisponivel
              ? "Acionar tradução em LIBRAS via VLibras"
              : "Aguarde o widget VLibras carregar..."
          }
        >
          🤟 LIBRAS
        </button>
      </div>

      {descricaoExpandida && (
        <div
          aria-live="polite"
          className="mt-4 rounded-md bg-neutral-900/60 p-3 text-sm leading-relaxed text-neutral-200"
        >
          <p>{obra.acessibilidade.textoAudiodescricaoLonga}</p>
        </div>
      )}

      {librasAtivada && (
        <div
          aria-live="polite"
          className="mt-4 rounded-md bg-blue-950/80 p-3 text-sm leading-relaxed text-blue-100"
        >
          <p>{obra.acessibilidade.textoLibras}</p>
        </div>
      )}

      <p className="sr-only">{obra.acessibilidade.textoAudiodescricaoCurta}</p>
    </section>
  );
}
