"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { finalCta } from "@/data/home";
import type { ContactFieldErrors, ContactResponse } from "@/lib/contact/types";
import { parseContactBody, validateContactPayload } from "@/lib/contact/validate";
import { withBasePath } from "@/lib/paths";
import styles from "./ContactSection.module.css";

type Status = "idle" | "submitting" | "success" | "error";

function contactEndpoint(): string {
  const configured = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim();
  if (configured) return configured;
  return withBasePath("/api/contact");
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    setMessage("");
    setFieldErrors({});

    const payload = parseContactBody({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      comment: data.get("comment"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
    });

    const localErrors = validateContactPayload(payload);
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setMessage("Проверьте поля формы");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(contactEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result: ContactResponse | null = null;
      try {
        result = (await response.json()) as ContactResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result || result.ok === false) {
        const errorResult = result && result.ok === false ? result : null;
        setFieldErrors(errorResult?.fields ?? {});
        setMessage(errorResult?.error || finalCta.form.errorFallback);
        setStatus("error");
        return;
      }

      form.reset();
      setMessage(finalCta.form.success);
      setStatus("success");
    } catch {
      setMessage(finalCta.form.errorFallback);
      setStatus("error");
    }
  }

  const busy = status === "submitting";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <input
          className={`${styles.input}${fieldErrors.name ? ` ${styles.inputError}` : ""}`}
          type="text"
          name="name"
          placeholder={finalCta.form.name}
          autoComplete="name"
          disabled={busy}
          aria-invalid={Boolean(fieldErrors.name)}
          required
        />
        {fieldErrors.name ? (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <input
          className={`${styles.input}${fieldErrors.email ? ` ${styles.inputError}` : ""}`}
          type="email"
          name="email"
          placeholder={finalCta.form.email}
          autoComplete="email"
          disabled={busy}
          aria-invalid={Boolean(fieldErrors.email)}
          required
        />
        {fieldErrors.email ? (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <input
          className={`${styles.input}${fieldErrors.phone ? ` ${styles.inputError}` : ""}`}
          type="tel"
          name="phone"
          placeholder={finalCta.form.phone}
          autoComplete="tel"
          disabled={busy}
          aria-invalid={Boolean(fieldErrors.phone)}
        />
        {fieldErrors.phone ? (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <input
          className={`${styles.input}${fieldErrors.comment ? ` ${styles.inputError}` : ""}`}
          type="text"
          name="comment"
          placeholder={finalCta.form.comment}
          disabled={busy}
          aria-invalid={Boolean(fieldErrors.comment)}
        />
        {fieldErrors.comment ? (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.comment}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from users */}
      <input
        className={styles.honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.field}>
        <label className={styles.consent}>
          <input
            className={`${styles.checkbox}${fieldErrors.consent ? ` ${styles.checkboxError}` : ""}`}
            type="checkbox"
            name="consent"
            disabled={busy}
            aria-invalid={Boolean(fieldErrors.consent)}
            required
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
        {fieldErrors.consent ? (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.consent}
          </p>
        ) : null}
      </div>

      {message ? (
        <p
          className={status === "success" ? styles.formSuccess : styles.formError}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className={`button ${styles.submit}`}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? finalCta.form.submitting : finalCta.form.submit}{" "}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
