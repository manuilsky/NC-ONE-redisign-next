import type { ContactPayload } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactSubject(name: string): string {
  const prefix = process.env.CONTACT_SUBJECT_PREFIX?.trim() || "Заявка с сайта";
  return `${prefix}: ${name}`;
}

export function buildContactEmail(payload: ContactPayload): { html: string; text: string } {
  const phone = payload.phone || "—";
  const comment = payload.comment || "—";

  const text = [
    "Новая заявка с сайта",
    "",
    `Имя: ${payload.name}`,
    `Email: ${payload.email}`,
    `Телефон: ${phone}`,
    `Комментарий: ${comment}`,
    "",
    "Согласие на обработку персональных данных: да",
  ].join("\n");

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px">Новая заявка с сайта</h2>
      <p style="margin:0 0 8px"><strong>Имя:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:0 0 8px"><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 8px"><strong>Комментарий:</strong><br>${escapeHtml(comment).replaceAll("\n", "<br>")}</p>
      <p style="margin:16px 0 0;color:#555">Согласие на обработку персональных данных: да</p>
    </div>
  `.trim();

  return { html, text };
}
