import { checkContactRateLimit } from "./rate-limit";
import { sendContactEmail } from "./send";
import type { ContactErrorResponse, ContactResponse } from "./types";
import { parseContactBody, validateContactPayload } from "./validate";

function json(data: ContactResponse, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function errorResponse(
  status: number,
  error: string,
  fields?: ContactErrorResponse["fields"],
  headers?: HeadersInit,
): Response {
  return json({ ok: false, error, fields }, { status, headers });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function corsHeaders(request: Request): Headers {
  const headers = new Headers();
  const allowed = process.env.CONTACT_CORS_ORIGIN?.trim();
  const origin = request.headers.get("origin");

  if (allowed && origin && (allowed === "*" || allowed === origin)) {
    headers.set("Access-Control-Allow-Origin", allowed === "*" ? "*" : origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Vary", "Origin");
  }

  return headers;
}

export function  handleContactOptions(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function handleContactPost(request: Request): Promise<Response> {
  const headers = corsHeaders(request);

  const limit = checkContactRateLimit(clientKey(request));
  if (!limit.ok) {
    if (limit.retryAfterSec) {
      headers.set("Retry-After", String(limit.retryAfterSec));
    }
    return errorResponse(
      429,
      "Слишком много заявок. Попробуйте позже.",
      undefined,
      headers,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "Некорректный формат запроса", undefined, headers);
  }

  const payload = parseContactBody(body);

  // Honeypot: pretend success so bots don't retry.
  if (payload.website) {
    return json({ ok: true }, { status: 200, headers });
  }

  const fields = validateContactPayload(payload);
  if (Object.keys(fields).length > 0) {
    return errorResponse(400, "Проверьте поля формы", fields, headers);
  }

  const result = await sendContactEmail(payload);

  if (!result.ok && result.reason === "missing_config") {
    console.error("[contact]", result.message);
    return errorResponse(
      503,
      "Отправка заявок временно недоступна. Напишите нам на почту или в Telegram.",
      undefined,
      headers,
    );
  }

  if (!result.ok) {
    console.error("[contact] send failed:", result.message);
    return errorResponse(
      502,
      "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.",
      undefined,
      headers,
    );
  }

  return json({ ok: true }, { status: 200, headers });
}
