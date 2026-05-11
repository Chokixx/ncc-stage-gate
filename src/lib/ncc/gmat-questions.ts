// Banco de 20 preguntas del GMAT NCC.
// TODO: reemplazar `text` y `options` con el enunciado real y `correctIndex`
// con el índice (0-based) de la opción correcta una vez se reciban las preguntas
// oficiales. La estructura ya queda lista para conectar al evaluador.

export type GmatQuestion = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

export const GMAT_QUESTIONS: GmatQuestion[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  text: `Pregunta ${i + 1} — pendiente de cargar el enunciado oficial.`,
  options: ["Opción A", "Opción B", "Opción C", "Opción D"],
  correctIndex: 0,
}));

export const GMAT_DURATION_MINUTES = 45;
