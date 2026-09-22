"use client";

import Link from "next/link";
import { finalCta } from "@/data/home";
import styles from "./ContactSection.module.css";

export function ContactForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
      noValidate
    >
      <input
        className={styles.input}
        type="text"
        name="name"
        placeholder={finalCta.form.name}
        autoComplete="name"
      />
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder={finalCta.form.email}
        autoComplete="email"
      />
      <input
        className={styles.input}
        type="tel"
        name="phone"
        placeholder={finalCta.form.phone}
        autoComplete="tel"
      />
      <input
        className={styles.input}
        type="text"
        name="comment"
        placeholder={finalCta.form.comment}
      />
      <label className={styles.consent}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="consent"
        />
        <span>
          {finalCta.form.consentBefore}
          <Link
            href={finalCta.form.consentHref}
            className={styles.consentLink}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {finalCta.form.consentLink}
          </Link>
        </span>
      </label>
      <button type="submit" className={`button ${styles.submit}`}>
        {finalCta.form.submit} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
