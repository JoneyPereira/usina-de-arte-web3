"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

const SELETOR_WIDGET = "[vw]";
const SELETOR_BOTAO = "[vw-access-button]";

function widgetCarregado(): boolean {
  if (typeof document === "undefined") return false;
  const raiz = document.querySelector(SELETOR_WIDGET);
  if (!raiz) return false;
  return raiz.classList.contains("enabled");
}

export function useVLibras() {
  const [disponivel, setDisponivel] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checar = () => {
      if (widgetCarregado()) {
        setDisponivel(true);
        return true;
      }
      return false;
    };

    if (checar()) return;

    const intervalo = setInterval(() => {
      if (checar()) clearInterval(intervalo);
    }, 500);

    const timeout = setTimeout(() => clearInterval(intervalo), 15000);

    return () => {
      clearInterval(intervalo);
      clearTimeout(timeout);
    };
  }, []);

  const abrirWidget = () => {
    if (typeof document === "undefined") return;
    const botao = document.querySelector<HTMLElement>(SELETOR_BOTAO);
    botao?.click();
  };

  const traduzir = (texto: string) => {
    if (typeof window === "undefined") return;
    abrirWidget();
    // VLibras lê seleção do DOM. Cria nó temporário, seleciona, dispara tradução.
    const noTemp = document.createElement("div");
    noTemp.textContent = texto;
    noTemp.style.position = "fixed";
    noTemp.style.left = "-9999px";
    noTemp.setAttribute("aria-hidden", "true");
    document.body.appendChild(noTemp);

    const range = document.createRange();
    range.selectNodeContents(noTemp);
    const selecao = window.getSelection();
    selecao?.removeAllRanges();
    selecao?.addRange(range);

    document.dispatchEvent(new Event("mouseup"));

    setTimeout(() => {
      selecao?.removeAllRanges();
      noTemp.remove();
    }, 500);
  };

  return { disponivel, traduzir, abrirWidget };
}
