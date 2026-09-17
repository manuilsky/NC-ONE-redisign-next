import Link from "next/link";
import { footer } from "@/data/home";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {footer.copyrightFrom} — {year} {footer.entity}
        </p>
        <nav className={styles.links} aria-label="Юридическая информация">
          {footer.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className={styles.rights}>{footer.rights}</p>
      </div>
    </footer>
  );
}
