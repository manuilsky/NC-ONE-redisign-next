import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.brand}>НК 1</p>
          <p className={styles.muted}>новая компания один</p>
        </div>
        <nav className={styles.links} aria-label="Навигация в подвале">
          <Link href="/projects">Проекты</Link>
          <Link href="/#services">Услуги</Link>
          <Link href="/#contact">Контакты</Link>
        </nav>
        <p className={styles.muted}>© {year}. NC 1</p>
      </div>
    </footer>
  );
}
