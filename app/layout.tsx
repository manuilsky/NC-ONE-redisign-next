import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { HashScroll } from "@/components/HashScroll";
import { Header } from "@/components/Header";
import { ScrollVideoBackground } from "@/components/ScrollVideoBackground";
import { SCROLL_BG_POSTER, SCROLL_BG_VIDEO } from "@/data/media";
import { basePath } from "@/lib/paths";
import "./globals.css";

const homeScrollBoot = `(function(){try{
var base=${JSON.stringify(basePath)};
var path=location.pathname.replace(/\\/+$/,"")||"/";
var normalized=base.replace(/\\/+$/,"");
var home=!normalized||path==="/"||path===normalized;
if(!home)return;
if("scrollRestoration" in history)history.scrollRestoration="manual";
function top(){
try{window.scrollTo({top:0,left:0,behavior:"instant"});}catch(e){window.scrollTo(0,0);}
document.documentElement.scrollTop=0;
document.body.scrollTop=0;
}
var nav=performance.getEntriesByType("navigation")[0];
var reload=nav&&nav.type==="reload";
if(reload&&location.hash)history.replaceState(null,"",location.pathname+location.search);
if(reload||!location.hash)top();
window.addEventListener("pageshow",function(event){
if(!event.persisted)return;
if(location.hash)history.replaceState(null,"",location.pathname+location.search);
top();
});
}catch(e){}})();`;

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
        <Script id="home-scroll-boot" strategy="beforeInteractive">
          {homeScrollBoot}
        </Script>
        <div className="site">
          <HashScroll />
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
