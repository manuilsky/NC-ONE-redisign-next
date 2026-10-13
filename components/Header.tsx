"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { withBasePath } from "@/lib/paths";
import styles from "./Header.module.css";

const links = [
  { href: "/#about", label: "о нас" },
  { href: "/#services", label: "услуги" },
  { href: "/projects", label: "кейсы" },
  { href: "/#contact", label: "контакты" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const onWheel = (event: WheelEvent) => {
      const menu = menuRef.current;
      if (menu && menu.contains(event.target as Node)) {
        const canScroll = menu.scrollHeight > menu.clientHeight;
        if (canScroll) return;
      }
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      const menu = menuRef.current;
      if (menu && menu.contains(event.target as Node)) {
        const canScroll = menu.scrollHeight > menu.clientHeight;
        if (canScroll) return;
      }
      event.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const mobileMenu =
    mounted &&
    createPortal(
      <div
        ref={menuRef}
        id={menuId}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileTop}>
          <Link
            href="/"
            className={styles.mobileBrand}
            aria-label="НК 1 — на главную"
            onClick={closeMenu}
          >
            НК1
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Закрыть меню"
            onClick={closeMenu}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="Мобильная навигация">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={closeMenu}
            >
              [ {link.label} ]
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className={`button buttonGhost ${styles.mobileCta}`}
          onClick={closeMenu}
        >
          связаться с нами <span aria-hidden="true">→</span>
        </Link>
      </div>,
      document.body,
    );

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="НК 1 — на главную">
          <Image
            src={withBasePath("/logo.png")}
            alt="НК 1 — новая компания один"
            width={300}
            height={101}
            className={styles.logoImage}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              [ {link.label} ]
            </Link>
          ))}
        </nav>

        <Link href="/#contact" className={`button ${styles.cta}`}>
          Связаться с нами <span aria-hidden="true">→</span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(true)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6H21M3 12H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {mobileMenu}
    </header>
  );
}
