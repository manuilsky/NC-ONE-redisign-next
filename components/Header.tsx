import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const links = [
  { href: "/#about", label: "о нас" },
  { href: "/#services", label: "услуги" },
  { href: "/#projects", label: "кейсы" },
  { href: "/#contact", label: "контакты" },
];

export function Header() {
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
      </div>
    </header>
  );
}
