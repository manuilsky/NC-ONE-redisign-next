"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type HashLinkProps = ComponentProps<typeof Link>;

function getHash(href: string) {
  const index = href.indexOf("#");
  return index === -1 ? null : href.slice(index + 1) || null;
}

/** Link that reliably scrolls to in-page anchors (Next Link + basePath is flaky). */
export function HashLink({ href, onClick, ...rest }: HashLinkProps) {
  const hrefStr = typeof href === "string" ? href : "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const hash = getHash(hrefStr);
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    // Section is already on this page — scroll here instead of a soft route change.
    event.preventDefault();
    const url = new URL(window.location.href);
    url.hash = hash;
    window.history.pushState(null, "", `${url.pathname}${url.search}#${hash}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
