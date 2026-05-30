"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface OpcoesReproducao {
  textoFallback?: string;
}

export function useAudiodescricao() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tocando, setTocando] = useState(false);

  const parar = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setTocando(false);
  }, []);

  const falarComTTS = useCallback((texto: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.onend = () => setTocando(false);
    utterance.onerror = () => setTocando(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setTocando(true);
  }, []);

  const reproduzir = useCallback(
    (caminho: string, opcoes: OpcoesReproducao = {}) => {
      parar();
      const audio = new Audio(caminho);
      audioRef.current = audio;
      audio.onended = () => setTocando(false);
      audio.onerror = () => {
        setTocando(false);
        if (opcoes.textoFallback) falarComTTS(opcoes.textoFallback);
      };
      audio
        .play()
        .then(() => setTocando(true))
        .catch(() => {
          setTocando(false);
          if (opcoes.textoFallback) falarComTTS(opcoes.textoFallback);
        });
    },
    [parar, falarComTTS],
  );

  useEffect(() => {
    return () => {
      parar();
    };
  }, [parar]);

  return { reproduzir, parar, falarComTTS, tocando };
}
