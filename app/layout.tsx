import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollVideoBackground } from "@/components/ScrollVideoBackground";
import { SCROLL_BG_POSTER, SCROLL_BG_VIDEO } from "@/data/media";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NC 1 — архитектура цифрового будущего",
    template: "%s | NC 1",
  },
  description:
    "Международная IT-компания: разработка ПО, AI, highload и технологическое партнёрство.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="site">
          <ScrollVideoBackground
            src={SCROLL_BG_VIDEO || undefined}
            poster={SCROLL_BG_POSTER || undefined}
          />
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
