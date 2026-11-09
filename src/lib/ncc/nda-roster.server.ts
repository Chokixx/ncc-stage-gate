import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { assertAllNdaMembers, normalizeNdaName } from "./nda-validation";

export async function validateTeamNda(teamName: string, names: string[]) {
  const { data, error } = await supabaseAdmin.from("ncc_registered_teams").select("name, members");
  if (error) throw new Error("No se pudo comprobar la lista de integrantes. Intenta nuevamente.");
  const teams = data?.length ? data : (await import("./equipos-2026")).EQUIPOS_NCC_2026;
  const matching = teams.filter((team) => normalizeNdaName(team.name) === normalizeNdaName(teamName));
  if (matching.length !== 1) throw new Error("Selecciona un equipo registrado con nombre único. Contacta a NCC si no aparece.");
  const members = matching[0].members;
  const namesFromRoster = Array.isArray(members) ? members.flatMap((member) => {
    if (member && typeof member === "object" && "name" in member && typeof member.name === "string") return [member.name];
    return [];
  }) : [];
  assertAllNdaMembers(namesFromRoster, names);
}