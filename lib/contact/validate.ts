import type { ContactFieldErrors, ContactPayload } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactBody(body: unknown): ContactPayload {
  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  return {
    name: asString(data.name),
    email: asString(data.email),
    phone: asString(data.phone),
    comment: asString(data.comment),
    consent: data.consent === true || data.consent === "true" || data.consent === "on",
    website: asString(data.website),
  };
}

export function validateContactPayload(payload: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!payload.name) {
    errors.name = "Укажите имя";
  } else if (payload.name.length < 2) {
    errors.name = "Имя слишком короткое";
  } else if (payload.name.length > 100) {
    errors.name = "Имя слишком длинное";
  }

  if (!payload.email) {
    errors.email = "Укажите email";
  } else if (!EMAIL_RE.test(payload.email) || payload.email.length > 254) {
    errors.email = "Некорректный email";
  }

  if (payload.phone && payload.phone.length > 40) {
    errors.phone = "Телефон слишком длинный";
  }

  if (payload.comment && payload.comment.length > 2000) {
    errors.comment = "Комментарий слишком длинный";
  }

  if (!payload.consent) {
    errors.consent = "Нужно согласие на обработку данных";
  }

  return errors;
}
