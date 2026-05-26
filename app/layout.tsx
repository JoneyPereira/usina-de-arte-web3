import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UsinaVR — Museu Digital Imersivo",
  description:
    "Experiência em Realidade Virtual que democratiza o acesso ao acervo da Usina de Arte, em Água Preta - Pernambuco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
