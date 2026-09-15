// Server-only: envía cada entrega de caso a la hoja "Entregas" del mismo Sheets
// donde se registran las inscripciones.
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1aikPHY5JjuLln1ZjzQOWvSsu-gk4KWRJqu3nUmglcB4";
const TAB = "Entregas";

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
  "Equipo",
  "Nombre",
  "Correo",
  "Archivo PDF",
  "Archivo Excel",
];

async function ensureTab() {
  const res = await fetch(`${GATEWAY_URL}/spreadsheets/${SHEET_ID}:batchUpdate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: TAB } } }] }),
  });
  if (res.ok) {
    await fetch(
      `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${TAB}!A1?valueInputOption=USER_ENTERED`,
      { method: "PUT", headers: authHeaders(), body: JSON.stringify({ values: [HEADERS] }) },
    );
  }
}

export async function appendSubmissionRow(input: {
  stage: string;
  team: string;
  fullName: string;
  email: string;
  pdfUrl: string | null;
  pdfName: string | null;
  dataUrl: string | null;
  dataName: string | null;
}) {
  await ensureTab();

  const link = (url: string | null, name: string | null) =>
    url ? `=HYPERLINK("${url}";"${(name ?? "Descargar").replace(/"/g, "'")}")` : "";

  const row = [
    new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    input.stage.toUpperCase(),
    input.team,
    input.fullName,
    input.email,
    link(input.pdfUrl, input.pdfName),
    link(input.dataUrl, input.dataName),
  ];

  const res = await fetch(
    `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${TAB}!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify({ values: [row] }) },
  );
  if (!res.ok) {
    throw new Error(`Sheets append falló [${res.status}]: ${await res.text()}`);
  }
}
