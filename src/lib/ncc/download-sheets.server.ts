// Server-only: registra cada descarga de caso en una hoja por etapa
// ("DATOS DESCARGAS ALPHA", etc.) del mismo Google Sheets del registro.
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1aikPHY5JjuLln1ZjzQOWvSsu-gk4KWRJqu3nUmglcB4";

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

const HEADERS = [
  "Fecha",
  "Etapa",
  "Tipo de archivo",
  "Equipo",
  "Nombre",
  "Correo",
  "Código único",
  "Archivo",
  "IP",
  "Navegador",
];

export function downloadTabName(stage: string) {
  return `DATOS DESCARGAS ${stage.toUpperCase()}`;
}

async function ensureTab(tab: string) {
  const res = await fetch(`${GATEWAY_URL}/spreadsheets/${SHEET_ID}:batchUpdate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
  });
  if (res.ok) {
    await fetch(
      `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${tab}!A1?valueInputOption=USER_ENTERED`,
      { method: "PUT", headers: authHeaders(), body: JSON.stringify({ values: [HEADERS] }) },
    );
  }
}

export async function appendDownloadRow(input: {
  stage: string;
  kind: string;
  team: string;
  fullName: string;
  email: string;
  code: string;
  fileName: string;
  ip: string | null;
  userAgent: string | null;
}) {
  const tab = downloadTabName(input.stage);
  await ensureTab(tab);

  const row = [
    new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    input.stage.toUpperCase(),
    input.kind === "case_pdf" ? "Caso (PDF)" : "Base de datos",
    input.team,
    input.fullName,
    input.email,
    input.code,
    input.fileName,
    input.ip ?? "",
    input.userAgent ?? "",
  ];

  const res = await fetch(
    `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${tab}!A:J:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify({ values: [row] }) },
  );
  if (!res.ok) {
    throw new Error(`Sheets append falló [${res.status}]: ${await res.text()}`);
  }
}
