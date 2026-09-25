"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import styles from "./Header.module.css";

const links = [
  { href: "/#about", label: "о нас" },
  { href: "/#services", label: "услуги" },
  { href: "/#projects", label: "кейсы" },
  { href: "/#contact", label: "контакты" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="НК 1 — на главную">
          <Image
            src="/logo.png"
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
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H21M3 12H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>
      </div>

      <div
        id={menuId}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
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
          className={`button ${styles.mobileCta}`}
          onClick={closeMenu}
        >
          Связаться с нами <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
