// Server-only: envía cada inscripción a Google Sheets vía connector gateway.
// Cada participante es una fila; el nombre del equipo va en la columna A para
// agrupar visualmente y se puede usar Data > Crear filtro / Ordenar por A.
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1aikPHY5JjuLln1ZjzQOWvSsu-gk4KWRJqu3nUmglcB4";
const TAB = "Inscripciones";

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
  "Equipo",
  "Modalidad",
  "Integrante",
  "Nombre completo",
  "Cédula",
  "Correo",
  "Celular",
  "Universidad",
  "Pregrado",
  "Semestre",
  "Comprobante",
  "Consentimiento",
  "Fecha",
];

async function ensureTab() {
  // Intenta crear la pestaña; si ya existe, Sheets devuelve 400 y lo ignoramos.
  const url = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}:batchUpdate`;
  const body = {
    requests: [{ addSheet: { properties: { title: TAB } } }],
  };
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.ok) {
    // pestaña recién creada → escribir cabeceras
    const headerUrl = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${TAB}!A1?valueInputOption=USER_ENTERED`;
    await fetch(headerUrl, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ values: [HEADERS] }),
    });
  }
  // Si !res.ok asumimos "ya existe" y seguimos.
}

export type SheetParticipant = {
  fullName: string;
  cedula: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  semester: string;
  consentUrl?: string | null;
};

export async function appendRegistrationRows(input: {
  teamName: string;
  mode: "solo" | "team";
  participants: SheetParticipant[];
  proofUrl: string | null;
}) {
  await ensureTab();

  const now = new Date().toISOString();
  const rows = input.participants.map((p, i) => [
    input.teamName,
    input.mode === "solo" ? "Individual" : "Equipo",
    String(i + 1),
    p.fullName,
    p.cedula,
    p.email,
    p.phone,
    p.university,
    p.program,
    p.semester,
    input.proofUrl ?? "",
    p.consentUrl ?? "",
    now,
  ]);

  const range = `${TAB}!A:M`;
  const url = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ values: rows }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets append falló [${res.status}]: ${text}`);
  }
}
