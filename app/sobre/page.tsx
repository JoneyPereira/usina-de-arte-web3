import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest text-amber-300"
        >
          USINA<span className="text-white">VR</span>
        </Link>
        <Link
          href="/museu"
          className="rounded-full border border-amber-300/40 px-4 py-1.5 text-xs uppercase tracking-widest text-amber-200 hover:bg-amber-300/10"
        >
          Entrar no museu
        </Link>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-12 leading-relaxed">
        <h1 className="text-4xl font-semibold md:text-5xl">Sobre o projeto</h1>
        <p className="mt-6 text-lg text-neutral-300">
          A{" "}
          <a
            href="https://www.usinadearte.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 underline-offset-4 hover:underline"
          >
            Usina de Arte
          </a>{" "}
          é um parque artístico-botânico instalado nas dependências da antiga
          Usina Santa Terezinha (fundada em 1929), em Água Preta — Zona da
          Mata Sul de Pernambuco. Com mais de 45 obras de artistas nacionais e
          internacionais espalhadas por mais de 30 hectares, o espaço é uma
          das iniciativas culturais mais importantes do Nordeste brasileiro.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-amber-200">
          O problema
        </h2>
        <p className="mt-4 text-neutral-300">
          O acesso ao museu é gratuito, mas geograficamente restrito: a 150 km
          de Recife e sem transporte público direto, o acervo permanece
          inacessível para estudantes de escolas públicas, pessoas com
          mobilidade reduzida e visitantes de fora do estado.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-amber-200">
          A solução
        </h2>
        <p className="mt-4 text-neutral-300">
          O UsinaVR cria uma experiência imersiva e navegável pelo navegador,
          sem instalação, que permite que qualquer pessoa visite e interaja
          com as obras do museu — independentemente de onde esteja.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-amber-200">
          Tecnologias
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-neutral-300 sm:grid-cols-2">
          <li>Next.js 14 (App Router)</li>
          <li>React Three Fiber + Drei</li>
          <li>@react-three/xr (WebXR)</li>
          <li>Tailwind CSS</li>
          <li>Framer Motion</li>
          <li>Zustand (estado compartilhado)</li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-amber-200">
          Créditos
        </h2>
        <p className="mt-4 text-neutral-300">
          Desenvolvido por <strong>Joney Sousa Pereira</strong> para o Hackweb
          Web3 — RESTIC 29 · Desafio ExpoVerse, em maio de 2025. O conteúdo
          artístico referenciado (obras, artistas, imagens) é propriedade da
          Usina de Arte e dos respectivos artistas.
        </p>

        <div className="mt-12 flex gap-3">
          <Link
            href="/museu"
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black shadow-lg shadow-amber-500/30"
          >
            Entrar no museu
          </Link>
          <Link
            href="/"
            className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-200 hover:border-amber-300/60"
          >
            Voltar à home
          </Link>
        </div>
      </article>
    </main>
  );
}
