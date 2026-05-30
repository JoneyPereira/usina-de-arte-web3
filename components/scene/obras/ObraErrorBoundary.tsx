"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  erro: boolean;
}

export class ObraErrorBoundary extends Component<Props, State> {
  state: State = { erro: false };

  static getDerivedStateFromError(): State {
    return { erro: true };
  }

  componentDidCatch() {
    // Silencioso: enquanto o .glb não estiver disponível, o fallback primitivo é usado.
  }

  render() {
    if (this.state.erro) return this.props.fallback;
    return this.props.children;
  }
}
