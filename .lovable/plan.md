Plan de implementación:

1. Bloquear reintentos del GMAT
- Haré que el backend rechace cualquier nuevo envío si ese grupo ya tiene un resultado registrado.
- Añadiré una protección en la base de datos para que no existan dos envíos del mismo grupo, incluso si recargan la página o intentan mandar la petición manualmente.
- En la pantalla de selección/quiz mostraré un mensaje claro si el grupo ya envió el GMAT, sin permitir iniciar otro intento.

2. Mantener la nota final oculta para los participantes
- La pantalla final seguirá diciendo que el examen fue enviado, pero no mostrará puntaje ni respuestas correctas.
- El resultado final solo viajará a canales internos: correo y Google Sheets.

3. Ajustar el correo de resultados
- Actualizaré el correo interno para que incluya el resultado final del grupo.
- Mantendré el correo solo para los organizadores, no visible para los participantes.
- También incluiré las respuestas elegidas por pregunta en formato claro, usando letras tipo A, B, C, D.

4. Ajustar Google Sheets
- Cambiaré la fila que se guarda en la hoja para que tenga estas columnas: Grupo, Preguntas, Resultados finales, Tiempo usado.
- En “Preguntas” guardaré las respuestas por número de pregunta con su opción seleccionada, por ejemplo: P1: A, P2: C.
- “Resultados finales” quedará como puntaje/total.
- “Tiempo usado” quedará en minutos.
- También ajustaré el Top 50 para que use el mismo formato coherente cuando corresponda.

5. “Pon la opción A”
- En el banco actual de preguntas, la respuesta correcta ya está configurada como la opción A para todas las preguntas.
- Lo dejaré explícito y consistente en el cálculo y en los reportes para que las respuestas se lean como opción A/B/C/D, no como números.

Detalles técnicos:
- El endpoint `/api/public/gmat/submit` hará la validación final contra la base de datos antes de insertar.
- Se agregará una restricción única por grupo en los envíos del GMAT.
- Se actualizarán los helpers de correo y Sheets para serializar respuestas como letras.
- Si ya existen envíos duplicados antiguos, la migración conservará el primer envío de cada grupo y evitará duplicados futuros.