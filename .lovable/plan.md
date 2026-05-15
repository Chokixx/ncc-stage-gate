Encontré **29 preguntas** en el archivo (numeradas 1, 2, 3, 4, 5, 7–15, 17–22, 24–32; saltan 6, 16 y 23). Cada una tiene **5 opciones** y la “Opción Correcta” marcada solo en el Excel — los participantes nunca la verán.

## 1. Reemplazar el banco de preguntas
Sustituir `src/lib/ncc/gmat-questions.ts` (que hoy tiene 20 preguntas placeholder con 4 opciones) por las 29 reales del Excel:
- Cada pregunta queda como `{ id, text, options: [5 strings], correctIndex }`.
- Los enunciados se mantienen tal cual (incluyen notación tipo `sqrt(324)`, `|x|`, exponentes, etc.).
- El `correctIndex` se guarda **solo en el archivo del servidor**; nunca se envía al frontend ya que el quiz lee el banco y se renderiza en el cliente.

## 2. Que la respuesta correcta NO viaje al cliente
Hoy el archivo `gmat-questions.ts` se importa tanto desde el quiz (cliente) como desde el endpoint de envío (servidor), así que el `correctIndex` está visible en el bundle del navegador (cualquier usuario técnico podría leerlo).

Solución: separar el banco en dos archivos:
- `src/lib/ncc/gmat-questions.ts` → solo `id`, `text`, `options`, `GMAT_DURATION_MINUTES`. Es lo único que importa el quiz en el cliente.
- `src/lib/ncc/gmat-answers.server.ts` → mapa `{ [id]: correctIndex }`. Solo lo importa el endpoint `/api/public/gmat/submit` para calificar.

Así el bundle del navegador deja de contener las respuestas correctas.

## 3. Render del formulario
El componente `src/routes/etapa.gmat.quiz.tsx` ya renderiza dinámicamente `q.options.map(...)`, así que automáticamente mostrará 5 opciones por pregunta. No hay que marcar ni resaltar nada como correcto. Solo se muestran A/B/C/D/E (texto plano de cada opción).

## 4. Validación automática en el envío
- Mantener la lógica actual: el endpoint `submit.ts` recibe `answers: number[]` y calcula `score` comparando contra `gmat-answers.server.ts`.
- Ajustar el schema Zod:
  - `answers` pasa de longitud 20 → 29.
  - rango por respuesta: `min(-1).max(4)` (5 opciones, índice 0–4; -1 = sin responder).
- El cliente nunca recibe respuestas correctas ni puntaje desglosado por pregunta — solo se guarda en BD, se manda al correo interno y al Google Sheet, como ya quedó configurado.

## 5. Pantalla final del participante
Sin cambios: sigue diciendo “Examen enviado” sin mostrar puntaje (ya quedó así en la iteración anterior).

## Pregunta abierta
- El banco actual asume **20 preguntas / 45 minutos**. Con 29 preguntas, ¿mantengo los 45 min o lo subo (sugiero 60–65 min)? Por ahora dejo **45 min** salvo que me digas otra cosa.

## Archivos a tocar
- `src/lib/ncc/gmat-questions.ts` — reescribir con las 29 preguntas (sin `correctIndex`).
- `src/lib/ncc/gmat-answers.server.ts` — **nuevo**, mapa de respuestas correctas.
- `src/routes/api/public/gmat/submit.ts` — importar respuestas desde el archivo `.server.ts`, ajustar Zod (largo 29, max 4).
- `src/lib/ncc/gmat-format.ts` — ya soporta letras A–E, no requiere cambios.
