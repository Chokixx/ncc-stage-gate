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
  "NDA Firmados",
  "Enlaces NDA",
  "Enlace YouTube",
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

// La hoja "Entregas" ya existía sin las columnas de NDA; se escriben por si acaso
// antes de guardar una entrega que sí los trae.
async function ensureNdaColumns() {
  const res = await fetch(
    `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${TAB}!H1:J1?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ values: [HEADERS.slice(7)] }),
    },
  );
  if (!res.ok) {
    console.error(`[Entregas] no se pudieron escribir los encabezados de NDA [${res.status}]`);
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
  nda: { member: string; url: string }[];
  youtubeUrl?: string | null;
}) {
  await ensureTab();

  const link = (url: string | null, _name: string | null) => url ?? "";

  const row = [
    new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    input.stage.toUpperCase(),
    input.team,
    input.fullName,
    input.email,
    link(input.pdfUrl, input.pdfName),
    link(input.dataUrl, input.dataName),
    input.nda.map((item) => item.member).join(", "),
    input.nda.map((item) => item.url).join("\n"),
    input.youtubeUrl ?? "",
  ];

  if (input.nda.length > 0 || input.youtubeUrl) await ensureNdaColumns();

  const res = await fetch(
    `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${TAB}!A:J:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify({ values: [row] }) },
  );
  if (!res.ok) {
    throw new Error(`Sheets append falló [${res.status}]: ${await res.text()}`);
  }
}
