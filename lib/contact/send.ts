import { Resend } from "resend";
import { buildContactEmail, buildContactSubject } from "./email";
import type { ContactPayload } from "./types";

export type ContactConfigError = {
  ok: false;
  reason: "missing_config";
  message: string;
};

export type ContactSendError = {
  ok: false;
  reason: "send_failed";
  message: string;
};

export type ContactSendSuccess = {
  ok: true;
  id?: string;
};

export type ContactSendResult =
  | ContactSendSuccess
  | ContactConfigError
  | ContactSendError;

function readConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const toRaw = process.env.CONTACT_TO_EMAIL?.trim();

  if (!apiKey || !from || !toRaw) {
    return null;
  }

  const to = toRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (to.length === 0) {
    return null;
  }

  return { apiKey, from, to };
}

export async function sendContactEmail(
  payload: ContactPayload,
): Promise<ContactSendResult> {
  const config = readConfig();

  if (!config) {
    return {
      ok: false,
      reason: "missing_config",
      message:
        "Почта ещё не настроена. Добавьте RESEND_API_KEY, CONTACT_FROM_EMAIL и CONTACT_TO_EMAIL.",
    };
  }

  const resend = new Resend(config.apiKey);
  const { html, text } = buildContactEmail(payload);

  const { data, error } = await resend.emails.send({
    from: config.from,
    to: config.to,
    replyTo: payload.email,
    subject: buildContactSubject(payload.name),
    html,
    text,
  });

  if (error) {
    return {
      ok: false,
      reason: "send_failed",
      message: error.message || "Не удалось отправить письмо",
    };
  }

  return { ok: true, id: data?.id };
}
