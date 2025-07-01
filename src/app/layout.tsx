import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taste & Trip - Planeje sua viagem com IA",
  description:
    "Roteiro personalizado + cardápio local + orçamento inteligente. Planeje viagens com inteligência artificial.",
  keywords: "viagem, roteiro, gastronomia, orçamento, inteligência artificial",
  authors: [{ name: "Taste & Trip" }],
  openGraph: {
    title: "Taste & Trip - Planeje sua viagem com IA",
    description:
      "Roteiro personalizado + cardápio local + orçamento inteligente",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
