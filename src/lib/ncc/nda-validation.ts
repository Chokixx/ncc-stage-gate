export function normalizeNdaName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function assertAllNdaMembers(expected: string[], provided: string[]) {
  if (expected.length === 0) throw new Error("El equipo no tiene integrantes registrados. Contacta a NCC.");
  const remaining = expected.map(normalizeNdaName);
  for (const name of provided) {
    const index = remaining.indexOf(normalizeNdaName(name));
    if (index < 0) throw new Error("Los comprobantes deben corresponder a todos los integrantes registrados, sin duplicados.");
    remaining.splice(index, 1);
  }
  if (remaining.length > 0) throw new Error("Falta el comprobante del NDA firmado de uno o más integrantes del equipo.");
}