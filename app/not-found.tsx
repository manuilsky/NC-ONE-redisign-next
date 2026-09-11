import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.text}>Такой страницы нет или проект удалён.</p>
        <Link href="/" className="button">
          На главную
        </Link>
      </div>
    </section>
  );
}
