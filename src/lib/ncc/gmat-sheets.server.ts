// Server-only helper: empuja los resultados del GMAT a Google Sheets vía el
// connector gateway de Lovable. NO importar desde código del cliente.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1aikPHY5JjuLln1ZjzQOWvSsu-gk4KWRJqu3nUmglcB4";
const RESULTS_TAB = "Resultados";
const TOP_TAB = "Top 50";
const TOP_LIMIT = 50;

function authHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY no configurado");
  if (!sheetsKey) throw new Error("GOOGLE_SHEETS_API_KEY no configurado");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": sheetsKey,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

function diffMinutes(startedAt: string | null, submittedAt: string): string {
  if (!startedAt) return "";
  const ms = new Date(submittedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  return (ms / 60000).toFixed(2);
}

function formatDate(iso: string): string {
  // Formato legible en zona Bogotá
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

export type GmatRow = {
  team: string;
  score: number;
  total: number;
  started_at: string | null;
  submitted_at: string;
};

export async function appendResultRow(row: GmatRow) {
  const range = `${RESULTS_TAB}!A:E`;
  const url = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const body = {
    values: [
      [
        row.team,
        row.score,
        row.total,
        diffMinutes(row.started_at, row.submitted_at),
        formatDate(row.submitted_at),
      ],
    ],
  };
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets append falló [${res.status}]: ${text}`);
  }
}

export async function rewriteTop50(rows: GmatRow[]) {
  // Ordenar por puntaje desc, luego por hora de envío asc (desempate: el primero gana)
  const sorted = [...rows].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    );
  });
  const top = sorted.slice(0, TOP_LIMIT).map((r, i) => [
    i + 1,
    r.team,
    r.score,
    diffMinutes(r.started_at, r.submitted_at),
    formatDate(r.submitted_at),
  ]);

  // Limpiar y reescribir
  const clearUrl = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TOP_TAB}!A2:E1000`)}:clear`;
  const clr = await fetch(clearUrl, { method: "POST", headers: authHeaders() });
  if (!clr.ok) {
    const text = await clr.text();
    throw new Error(`Sheets clear falló [${clr.status}]: ${text}`);
  }

  if (top.length === 0) return;
  const writeUrl = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${TOP_TAB}!A2`)}?valueInputOption=USER_ENTERED`;
  const res = await fetch(writeUrl, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ values: top }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets write Top 50 falló [${res.status}]: ${text}`);
  }
}
