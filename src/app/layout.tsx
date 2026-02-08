import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QA Playground | Pratique Automação de Testes",
  description: "Um playground real para QAs praticarem automação de testes de UI e API com Playwright, Cypress, Selenium e mais.",
  keywords: ["QA", "automação de testes", "Playwright", "Cypress", "Selenium", "testes", "prática"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
