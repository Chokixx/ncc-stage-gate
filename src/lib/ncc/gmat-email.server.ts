// Server-only: envía el correo de notificación de un envío del GMAT vía Resend.
// NO importar desde el cliente.

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "NCC GMAT <ncc@nationalcasecompetition.com>";
const TO = ["ncc@uniandes.edu.co"];
const CC = ["l.fonsecar@uniandes.edu.co", "jc.angela1@uniandes.edu.co"];

export type GmatEmailPayload = {
  team: string;
  score: number;
  total: number;
  started_at: string | null;
  submitted_at: string;
  answers: number[];
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

function durationMin(startedAt: string | null, submittedAt: string): string {
  if (!startedAt) return "—";
  const ms = new Date(submittedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";
  return `${(ms / 60000).toFixed(2)} min`;
}

export async function sendGmatResultEmail(p: GmatEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no configurado");

  const subject = `GMAT NCC 2026 — ${p.team} — ${p.score}/${p.total}`;
  const rows = p.answers
    .map(
      (a, i) =>
        `<tr><td style="padding:4px 8px;border:1px solid #ddd">${i + 1}</td><td style="padding:4px 8px;border:1px solid #ddd">${a >= 0 ? a + 1 : "—"}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1a1a">
      <h2 style="color:#125b50">Nuevo envío GMAT — National Case Competition 2026</h2>
      <p><strong>Equipo:</strong> ${p.team}</p>
      <p><strong>Puntaje:</strong> ${p.score} / ${p.total}</p>
      <p><strong>Inicio:</strong> ${p.started_at ? fmtDate(p.started_at) : "—"}</p>
      <p><strong>Envío:</strong> ${fmtDate(p.submitted_at)}</p>
      <p><strong>Duración:</strong> ${durationMin(p.started_at, p.submitted_at)}</p>
      <h3 style="margin-top:24px">Respuestas</h3>
      <table style="border-collapse:collapse;font-size:13px">
        <thead>
          <tr><th style="padding:4px 8px;border:1px solid #ddd">Pregunta</th><th style="padding:4px 8px;border:1px solid #ddd">Opción</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      cc: CC,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend falló [${res.status}]: ${text}`);
  }
}
