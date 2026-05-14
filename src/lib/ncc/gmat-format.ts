// Helpers de formato compartidos para reportes del GMAT.
export function answerToLetter(idx: number): string {
  if (idx < 0 || !Number.isFinite(idx)) return "—";
  return String.fromCharCode(65 + idx); // 0->A, 1->B, ...
}

export function answersToLetters(answers: number[]): string {
  // "P1: A, P2: C, P3: —"
  return answers
    .map((a, i) => `P${i + 1}: ${answerToLetter(a)}`)
    .join(", ");
}

export function durationMinutes(
  startedAt: string | null,
  submittedAt: string,
): string {
  if (!startedAt) return "";
  const ms = new Date(submittedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  return (ms / 60000).toFixed(2);
}
