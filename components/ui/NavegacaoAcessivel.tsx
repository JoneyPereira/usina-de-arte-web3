"use client";

import { obras } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";

export function NavegacaoAcessivel() {
  const setObraSelecionada = useMuseuStore((s) => s.setObraSelecionada);

  return (
    <nav aria-label="Lista de obras do museu" className="sr-only">
      <h2>Pontos de interesse do museu</h2>
      <ul>
        {obras.map((obra) => (
          <li key={obra.id}>
            <button
              type="button"
              onClick={() => setObraSelecionada(obra)}
              aria-label={`Abrir painel da obra ${obra.titulo}, de ${obra.artista}`}
            >
              {obra.titulo} — {obra.artista}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
