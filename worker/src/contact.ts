export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  subject?: string;
  source?: string;
  company?: string;
};

export type ContactEnv = {
  EMAIL?: SendEmail;
  NOTIFY_EMAIL?: string;
  CONTACT_FROM?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  headers: HeadersInit,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400, headers });
  }

  if (body.company?.trim()) {
    return Response.json({ ok: true }, { headers });
  }

  const name = body.name?.trim().slice(0, 80) ?? "";
  const email = body.email?.trim().slice(0, 254) ?? "";
  const message = body.message?.trim().slice(0, 4000) ?? "";
  const subject = (body.subject?.trim() || "お問い合わせ").slice(0, 120);
  const source = (body.source?.trim() || "ituyama.com").slice(0, 80);

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "validation" }, { status: 400, headers });
  }

  if (!env.EMAIL) {
    return Response.json({ ok: false, error: "email_unavailable" }, { status: 503, headers });
  }

  const notifyTo = env.NOTIFY_EMAIL || "ituyama01@gmail.com";
  const fromEmail = env.CONTACT_FROM || "contact@ituyama.com";

  const text = [`フォーム: ${source}`, "", `お名前: ${name}`, `メール: ${email}`, "", message].join(
    "\n",
  );

  const html = [
    `<p><strong>フォーム:</strong> ${escapeHtml(source)}</p>`,
    `<p><strong>お名前:</strong> ${escapeHtml(name)}<br>`,
    `<strong>メール:</strong> ${escapeHtml(email)}</p>`,
    "<hr>",
    `<pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>`,
  ].join("");

  try {
    await env.EMAIL.send({
      to: notifyTo,
      from: { email: fromEmail, name: "ituyama.com フォーム" },
      replyTo: { email, name },
      subject: `[ituyama.com] ${subject}`,
      text,
      html,
    });
  } catch (error) {
    console.error("contact send failed", error);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502, headers });
  }

  return Response.json({ ok: true }, { headers });
}
