// Lista de los 100 equipos del NCC.
// TODO: reemplazar por la lista definitiva enviada por los organizadores.
export const TEAMS: string[] = ["Prueba"];

// Mientras llega la lista oficial, generamos placeholders Equipo 001..Equipo 100
// para poder probar el flujo. Cuando se reemplace TEAMS arriba con la lista real,
// estos placeholders dejan de mostrarse automáticamente.
export const PLACEHOLDER_TEAMS: string[] = Array.from({ length: 100 }, (_, i) =>
  `Equipo ${String(i + 1).padStart(3, "0")}`,
);

export function getTeams(): string[] {
  return TEAMS.length > 0 ? TEAMS : PLACEHOLDER_TEAMS;
}
