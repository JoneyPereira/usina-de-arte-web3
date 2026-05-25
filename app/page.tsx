import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-950 via-neutral-950 to-black text-neutral-100">
      {/* Glow Golden Hour */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl"
      />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <span className="text-sm font-semibold tracking-widest text-amber-300">
          USINA<span className="text-white">VR</span>
        </span>
        <div className="flex gap-6 text-sm text-neutral-300">
          <Link href="/sobre" className="hover:text-amber-300">
            Sobre
          </Link>
          <Link href="/museu" className="hover:text-amber-300">
            Museu
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center md:py-28">
        <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
          Hackweb Web3 · ExpoVerse
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
          O acervo da Usina de Arte,{" "}
          <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
            acessível pelo navegador.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-neutral-300 md:text-lg">
          Um museu a céu aberto em Água Preta, Pernambuco — agora navegável de
          qualquer lugar. O UsinaVR recria um percurso imersivo entre obras de
          artistas brasileiros e internacionais, derrubando a barreira
          geográfica que afasta o público do parque.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/museu"
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black shadow-lg shadow-amber-500/30 transition hover:scale-[1.02]"
          >
            Entrar no museu
          </Link>
          <Link
            href="/sobre"
            className="rounded-full border border-neutral-700 px-8 py-3 text-sm font-medium text-neutral-200 hover:border-amber-300/60 hover:text-amber-200"
          >
            Saber mais
          </Link>
        </div>

        <ul className="mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <li className="rounded-xl border border-neutral-800 bg-black/40 p-5">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              5 obras
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              Pontos de interesse interativos no MVP — escaláveis para todo o
              acervo
            </p>
          </li>
          <li className="rounded-xl border border-neutral-800 bg-black/40 p-5">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              Sem instalação
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              Tudo roda no navegador. Computador, celular ou headset WebXR
            </p>
          </li>
          <li className="rounded-xl border border-neutral-800 bg-black/40 p-5">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              WebXR
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              Suporte opcional a Realidade Virtual com headsets compatíveis
            </p>
          </li>
        </ul>
      </section>

      <footer className="relative z-10 border-t border-neutral-900 px-8 py-6 text-center text-xs text-neutral-500">
        Hackweb Web3 — RESTIC 29 · Desafio ExpoVerse · Joney Sousa Pereira
      </footer>
    </main>
  );
}
