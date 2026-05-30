"use client";

import { useEffect, useState } from "react";
import { useAcessibilidadeStore } from "@/hooks/useMuseuStore";

export function PainelAcessibilidade() {
  const preferencias = useAcessibilidadeStore((s) => s.preferencias);
  const atualizar = useAcessibilidadeStore((s) => s.atualizarPreferencia);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = `${preferencias.tamanhoFonte}px`;
  }, [preferencias.tamanhoFonte]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (preferencias.altoContraste) {
      document.documentElement.dataset.tema = "alto-contraste";
    } else {
      delete document.documentElement.dataset.tema;
    }
  }, [preferencias.altoContraste]);

  return (
    <div className="fixed right-6 top-20 z-30">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls="painel-acessibilidade"
        aria-label="Abrir configurações de acessibilidade"
        className="rounded-full border border-amber-200/40 bg-black/70 px-4 py-2 text-xs font-semibold text-amber-200 shadow-lg backdrop-blur-md transition hover:bg-amber-300/10"
      >
        ♿ Acessibilidade
      </button>

      {aberto && (
        <aside
          id="painel-acessibilidade"
          aria-label="Configurações de acessibilidade"
          role="dialog"
          className="mt-3 w-72 rounded-xl border border-amber-200/30 bg-black/85 p-5 text-neutral-100 shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            Acessibilidade
          </h2>

          <div className="mt-4 space-y-4 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-300">
                Tamanho do texto: {preferencias.tamanhoFonte}px
              </span>
              <input
                type="range"
                min={12}
                max={28}
                step={1}
                value={preferencias.tamanhoFonte}
                onChange={(e) =>
                  atualizar("tamanhoFonte", Number(e.target.value))
                }
                aria-valuetext={`${preferencias.tamanhoFonte} pixels`}
                className="accent-amber-400"
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={preferencias.altoContraste}
                onChange={(e) =>
                  atualizar("altoContraste", e.target.checked)
                }
                className="accent-amber-400"
              />
              <span>Alto contraste</span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={preferencias.audiodescricaoAutomatica}
                onChange={(e) =>
                  atualizar("audiodescricaoAutomatica", e.target.checked)
                }
                className="mt-1 accent-amber-400"
              />
              <span>
                Audiodescrição automática ao se aproximar das obras
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={preferencias.librasAtivoPadrao}
                onChange={(e) =>
                  atualizar("librasAtivoPadrao", e.target.checked)
                }
                className="mt-1 accent-amber-400"
              />
              <span>Acionar LIBRAS automaticamente ao abrir uma obra</span>
            </label>
          </div>
        </aside>
      )}
    </div>
  );
}
