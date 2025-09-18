import Footer from "@/components/layout/footer";
import NavbarDesktop from "@/components/layout/navbarDesktop";
import NavbarMobile from "@/components/layout/navbarMobile";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Profills Brasil",
  description:
    "A Profills produz Máquinas Envasadoras para produtos líquidos, pastosos e sólidos, fornecendo o que há de melhor em embalagens flexíveis para empresas de todos os portes, e estando ao seu lado na confecção de plantas de fábricas.",

  keywords: [
    "Máquinas Envasadoras",
    "Profills Brasil",
    "Profills",
    "Embalagens Flexíveis",
    "Confecção de Plantas de Fábricas",
    "Máquinas Embaladoras",
    "Máquinas de Embalagem",
    "Máquinas de Embalagem Flexível",
    "Máquinas de Embalagem de Produtos Líquidos",
    "Máquinas de Embalagem de Produtos Pastosos",
    "Máquinas de Embalagem de Produtos Sólidos",
    "Máquinas de Embalagem de Produtos Líquidos e Pastosos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full w-full overflow-x-hidden antialiased`}
        suppressHydrationWarning
      >
        <NavbarDesktop />
        <NavbarMobile />
        <Toaster richColors />
        <main className="relative h-full w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
