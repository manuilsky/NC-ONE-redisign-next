import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollVideoBackground } from "@/components/ScrollVideoBackground";
import { SCROLL_BG_POSTER, SCROLL_BG_VIDEO } from "@/data/media";
import "./globals.css";

/**
 * Figma uses Commissioner as a variable font with FLAR/VOLM/slnt = 0.
 * Static weight files look slightly different from that cut.
 */
const body = Commissioner({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
  axes: ["FLAR", "VOLM", "slnt"],
});

export const metadata: Metadata = {
  title: {
    default: "НК 1 — архитектура цифрового будущего",
    template: "%s | НК 1",
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
    <html lang="ru" className={body.variable}>
      <body className={body.className}>
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
