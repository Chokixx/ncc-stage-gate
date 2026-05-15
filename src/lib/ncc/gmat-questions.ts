// Banco oficial de preguntas del GMAT NCC.
// Las respuestas correctas viven en gmat-answers.server.ts y NUNCA se exponen al cliente.

export type GmatQuestion = {
  id: number;
  text: string;
  options: string[];
};

export const GMAT_QUESTIONS: GmatQuestion[] = [
  {
    id: 1,
    text: `√324 + √289`,
    options: [`32`, `33`, `34`, `35`, `36`],
  },
  {
    id: 2,
    text: `√(36 + 64 + 5²) + √20`,
    options: [
      `19 + √20`,
      `19 · √20`,
      `√145`,
      `5 · √100 + √20`,
      `7 · √5`,
    ],
  },
  {
    id: 3,
    text: `Si x es un número entero y √x · x − x = a, ¿cuál de las siguientes afirmaciones debe ser verdadera? I. a es par.  II. a es positivo.  III. a es entero.`,
    options: [
      `Solo I`,
      `Solo II`,
      `Solo III`,
      `I y II`,
      `Ninguna de las anteriores`,
    ],
  },
  {
    id: 4,
    text: `¿Es X un número entero primo? (1) |X| = 2  (2) X² = 4`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 5,
    text: `¿Cuál de las siguientes expresiones tiene el mayor valor?`,
    options: [
      `999¹²`,
      `10³⁰`,
      `777¹⁰`,
      `(−20)²⁴`,
      `(√15)⁴⁰`,
    ],
  },
  {
    id: 7,
    text: `¿Cuál de los siguientes números es el mayor?`,
    options: [
      `1.876.452 ÷ 1.876.455`,
      `1.883.446 ÷ 1.883.449`,
      `1.883.453 ÷ 1.883.456`,
      `1.883.456 ÷ 1.883.459`,
      `1.883.491 ÷ 1.883.494`,
    ],
  },
  {
    id: 8,
    text: `¿Cuál es el menor valor posible del entero m si m ÷ n = 0,3636363636...?`,
    options: [`3`, `4`, `7`, `13`, `22`],
  },
  {
    id: 9,
    text: `¿Cuál de los siguientes números es un factor de 18! + 1?`,
    options: [`15`, `17`, `19`, `33`, `39`],
  },
  {
    id: 11,
    text: `Si S es la suma de los dígitos de un número dado, T es la suma de los dígitos de S, y G es la suma de los dígitos de T. Por ejemplo, S de 987 es 9 + 8 + 7 = 24, T de S es 2 + 4 = 6 y G de 6 es 6. Por lo tanto, G de 987 es 6. ¿Cuál de los siguientes números tiene el mayor G?`,
    options: [`94123`, `91964`, `64678`, `62355`, `45689`],
  },
  {
    id: 12,
    text: `Si N = 1234@ y @ representa el dígito de las unidades, ¿es N un múltiplo de 5? (1) @! no es divisible por 5  (2) @ es divisible por 9`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 13,
    text: `Si x = ⁴√(x³ + 6x²), ¿cuál es la suma de todas las soluciones posibles para x?`,
    options: [`−2`, `0`, `1`, `3`, `5`],
  },
  {
    id: 14,
    text: `Si −1 < x < 5, ¿cuál de las siguientes afirmaciones debe ser verdadera?`,
    options: [
      `|3 − x| < −3`,
      `|x| < 4`,
      `|x| − 2 > 2`,
      `|2 + x| > 3`,
      `|x − 2| < 3`,
    ],
  },
  {
    id: 17,
    text: `El conjunto T contiene más de un elemento. ¿Es la mediana del conjunto T mayor que su media? (1) El conjunto T tiene rango positivo. (2) Los elementos del conjunto no son enteros consecutivos.`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 18,
    text: `El conjunto S consta de N elementos. Si N > 2, ¿cuál es la desviación estándar de S? (1) La media y la mediana del conjunto son iguales. (2) La diferencia entre dos elementos cualesquiera del conjunto es la misma.`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 19,
    text: `¿Es la media del conjunto S mayor que su mediana? (1) Todos los elementos de S son múltiplos consecutivos de 3. (2) La suma de todos los elementos de S es igual a 75.`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 20,
    text: `Si a, b y c son enteros y a < b < c, ¿son a, b, c enteros consecutivos? (1) La mediana de {a!, b!, c!} es un número impar. (2) c! es un número primo.`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 21,
    text: `Un conjunto de 11 enteros distintos tiene una mediana de 25 y un rango de 50. ¿Cuál es el mayor entero posible que podría estar en este conjunto?`,
    options: [`65`, `70`, `75`, `80`, `85`],
  },
  {
    id: 22,
    text: `De 100 personas encuestadas, 60 eran mujeres. Si 10 eran mujeres fumadoras y 20 eran hombres fumadores, ¿qué porcentaje de los hombres encuestados eran no fumadores?`,
    options: [`10`, `20`, `30`, `40`, `50`],
  },
  {
    id: 24,
    text: `Un autobús de la ciudad M viaja hacia la ciudad N a velocidad constante mientras que otro autobús hace el mismo recorrido en sentido contrario a la misma velocidad. Se encuentran en el punto P después de 2 horas. Al día siguiente, un autobús se retrasa 24 minutos y el otro sale 36 minutos antes. Si se encuentran a 24 millas del punto P, ¿cuál es la distancia entre las dos ciudades?`,
    options: [`48`, `72`, `96`, `120`, `192`],
  },
  {
    id: 25,
    text: `Un tren viaja a velocidad constante y, después de hacer tres paradas de una hora, llega a su destino. Tras esperar una hora, hace el viaje de regreso parando un total de diez veces, treinta minutos cada una, pero viajando al doble de velocidad. Si ambos viajes tardaron lo mismo, ¿cuántas horas duró el viaje de ida y vuelta?`,
    options: [`14`, `15`, `16`, `17`, `18`],
  },
  {
    id: 26,
    text: `Un cocinero fue al mercado a comprar huevos y pagó $12. Pero como los huevos eran bastante pequeños, convenció al vendedor de añadirle dos huevos más, gratis. Al añadir los dos huevos, el precio por docena bajó un dólar. ¿Cuántos huevos se llevó el cocinero a casa?`,
    options: [`8`, `12`, `15`, `16`, `18`],
  },
  {
    id: 27,
    text: `La computadora A tarda 6 horas y 40 minutos en terminar un trabajo. La computadora B puede procesar el mismo trabajo en 10 horas. ¿Cuánto tardarán ambas computadoras trabajando juntas en terminar el trabajo?`,
    options: [
      `6 horas y 20 minutos`,
      `5 horas y 10 minutos`,
      `4 horas y 40 minutos`,
      `4 horas`,
      `3 horas y 20 minutos`,
    ],
  },
  {
    id: 28,
    text: `Los trabajadores A, B y C pueden completar una tarea en 10, 5 y x horas respectivamente. A empieza solo, B se une 2 horas después, C se une 2 horas después de eso, y A, B y C juntos terminan en 15 minutos. ¿Cuál es x?`,
    options: [`1`, `1,25`, `2`, `2,5`, `4`],
  },
  {
    id: 29,
    text: `Mac termina un trabajo en M días, Jack en J días. Después de trabajar juntos T días, Mac se va y Jack termina en R días. Si ambos completaron la misma cantidad de trabajo, ¿cuántos días necesitaría Jack solo para todo el trabajo? (1) M = 20 días  (2) R = 10 días`,
    options: [
      `La afirmación (1) SOLA es suficiente, pero la (2) SOLA no lo es`,
      `La afirmación (2) SOLA es suficiente, pero la (1) SOLA no lo es`,
      `AMBAS afirmaciones JUNTAS son suficientes, pero NINGUNA por sí SOLA lo es`,
      `CADA afirmación POR SÍ SOLA es suficiente`,
      `Las afirmaciones (1) y (2) JUNTAS NO son suficientes`,
    ],
  },
  {
    id: 30,
    text: `Los pintores A y B pueden pintar una casa solos en 20 y 30 días. Empezaron juntos, A se fue por algunos días, luego B trabajó solo durante 5 días, y luego A y B juntos terminaron en 4 días. ¿Después de cuántos días trabajando juntos se fue A?`,
    options: [`4`, `5`, `6`, `7`, `8`],
  },
  {
    id: 31,
    text: `¿Cuántos litros de alcohol puro deben añadirse a una solución de 40 litros que contiene 10 % de alcohol para duplicar la proporción de alcohol?`,
    options: [`4`, `5`, `10`, `20`, `40`],
  },
  {
    id: 32,
    text: `Un laboratorio de Alimentos y Medicamentos tiene dos muestras nuevas: una taza de 240 gramos de café de filtro, que contiene 124 mg de cafeína, y una taza de 60 gramos de espresso, que contiene 160 mg de cafeína. Si un técnico combinara ambas bebidas de modo que la nueva mezcla contuviera 50 % de café y 50 % de espresso, ¿cuántos mg de cafeína contendría la nueva bebida?`,
    options: [`111`, `121`, `144`, `191`, `382`],
  },
];

export const GMAT_DURATION_MINUTES = 45;
