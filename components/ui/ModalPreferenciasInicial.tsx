"use client";

import { useEffect, useRef } from "react";
import { useAcessibilidadeStore } from "@/hooks/useMuseuStore";

type Modo = "padrao" | "dv" | "surdo" | "contraste";

export function ModalPreferenciasInicial() {
  const preferencias = useAcessibilidadeStore((s) => s.preferencias);
  const atualizar = useAcessibilidadeStore((s) => s.atualizarPreferencia);
  const marcarDefinidas = useAcessibilidadeStore(
    (s) => s.marcarPreferenciasDefinidas,
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preferencias.preferenciasDefinidas) return;
    dialogRef.current?.focus();
  }, [preferencias.preferenciasDefinidas]);

  if (preferencias.preferenciasDefinidas) return null;

  const escolher = (modo: Modo) => {
    switch (modo) {
      case "padrao":
        break;
      case "dv":
        atualizar("audiodescricaoAutomatica", true);
        break;
      case "surdo":
        atualizar("librasAtivoPadrao", true);
        break;
      case "contraste":
        atualizar("altoContraste", true);
        break;
    }
    marcarDefinidas();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-prefs"
      aria-describedby="desc-prefs"
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
    >
      <div className="w-[min(92vw,560px)] rounded-2xl border border-amber-200/30 bg-neutral-950 p-8 text-neutral-100 shadow-2xl">
        <h1
          id="titulo-prefs"
          className="text-2xl font-semibold tracking-tight"
        >
          Como você prefere explorar o museu?
        </h1>
        <p id="desc-prefs" className="mt-2 text-sm text-neutral-300">
          Personalize a experiência conforme suas necessidades. Você pode
          alterar essas opções a qualquer momento no botão ♿ Acessibilidade.
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => escolher("padrao")}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-left transition hover:border-amber-300/60"
          >
            <p className="text-sm font-semibold">Experiência padrão</p>
            <p className="text-xs text-neutral-400">
              Navegação visual e auditiva sem recursos automáticos
            </p>
          </button>

          <button
            type="button"
            onClick={() => escolher("dv")}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-left transition hover:border-amber-300/60"
          >
            <p className="text-sm font-semibold">
              Com audiodescrição (deficiência visual)
            </p>
            <p className="text-xs text-neutral-400">
              Narração automática descreverá cada obra ao se aproximar
            </p>
          </button>

          <button
            type="button"
            onClick={() => escolher("surdo")}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-left transition hover:border-amber-300/60"
          >
            <p className="text-sm font-semibold">
              Com LIBRAS (deficiência auditiva)
            </p>
            <p className="text-xs text-neutral-400">
              Tradução em Língua Brasileira de Sinais via VLibras
            </p>
          </button>

          <button
            type="button"
            onClick={() => escolher("contraste")}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-left transition hover:border-amber-300/60"
          >
            <p className="text-sm font-semibold">Modo alto contraste</p>
            <p className="text-xs text-neutral-400">
              Texto e fundos com contraste reforçado para baixa visão
            </p>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Pressione qualquer opção para entrar no museu
        </p>
      </div>
    </div>
  );
}
