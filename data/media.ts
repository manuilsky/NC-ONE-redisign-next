import { withBasePath } from "@/lib/paths";

export type ScrollBgSource = {
  src: string;
  poster: string;
  /** CSS media query for preload / poster visibility. */
  media: string;
};

/** Matches layout breakpoints: mobile ≤767, tablet 768–1200, desktop ≥1201. */
export const SCROLL_BG_SOURCES = {
  desktop: {
    src: withBasePath("/video/rocket-desktop.mp4"),
    poster: withBasePath("/video/rocket-desktop.jpg"),
    media: "(min-width: 1201px)",
  },
  tablet: {
    src: withBasePath("/video/rocket-tablet.mp4"),
    poster: withBasePath("/video/rocket-tablet.jpg"),
    media: "(min-width: 768px) and (max-width: 1200px)",
  },
  mobile: {
    src: withBasePath("/video/rocket-mobile.mp4"),
    poster: withBasePath("/video/rocket-mobile.jpg"),
    media: "(max-width: 767px)",
  },
} as const satisfies Record<string, ScrollBgSource>;

export type ScrollBgBreakpoint = keyof typeof SCROLL_BG_SOURCES;
