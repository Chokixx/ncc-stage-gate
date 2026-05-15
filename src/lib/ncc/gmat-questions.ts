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
    text: `sqrt(324) + sqrt(289)`,
    options: [
      `32`,
      `33`,
      `34`,
      `35`,
      `36`
    ],
  },
  {
    id: 2,
    text: `sqrt(36+64+(5)^2) + sqrt(20)`,
    options: [
      `19 + sqrt(20)`,
      `19*sqrt(20)`,
      `sqrt(145)`,
      `5*sqrt(100)+sqrt(20)`,
      `7*sqrt(5)`
    ],
  },
  {
    id: 3,
    text: `If x is an integer and sqrt(x) * x - x = a , which of the following must be true? I. a is Even  II. a is Positive  III. a is an Integer`,
    options: [
      `I only`,
      `II only`,
      `III only`,
      `I and II`,
      `None of the above`
    ],
  },
  {
    id: 4,
    text: `Is X a prime integer? (1) |X| = 2  (2) X^2 = 4`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 5,
    text: `Which of the following expressions has the greatest value?`,
    options: [
      `999^(12)`,
      `10^(30)`,
      `777^(10)`,
      `(-20)^(24)`,
      `(sqrt(15))^40`
    ],
  },
  {
    id: 7,
    text: `Which of the following numbers is the greatest?`,
    options: [
      `1876452/1876455`,
      `1883446/1883449`,
      `1883453/1883456`,
      `1883456/1883459`,
      `1883491/1883494`
    ],
  },
  {
    id: 8,
    text: `What is the smallest possible value of integer m if m/n = 0.3636363636...?`,
    options: [
      `3`,
      `4`,
      `7`,
      `13`,
      `22`
    ],
  },
  {
    id: 9,
    text: `Which of the following is a factor of 18! + 1?`,
    options: [
      `15`,
      `17`,
      `19`,
      `33`,
      `39`
    ],
  },
  {
    id: 10,
    text: `Is x greater than 1? (1) (1/x) > -1  (2) (1/x^5) > (1/x^3)`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 11,
    text: `If S is the sum of the digits of a given number, T is the sum of digits of S, and G is the sum of digits in T. For example S og 987 is 9+8+7=24, T of S is 2+4=6 and G of 6 is 6. Therefore G of 987 is 6. Which of the following has the greatest G?`,
    options: [
      `94123`,
      `91964`,
      `64678`,
      `62355`,
      `45689`
    ],
  },
  {
    id: 12,
    text: `If N = 1234@ and @ represents the units digit, is N a multiple of 5? (1) @! is not divisible by 5  (2) @ is divisible by 9`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 13,
    text: `If x = sqrt4((x^3)+(6*x^2)), then the sum of all possible solutions for x?`,
    options: [
      `-2`,
      `0`,
      `1`,
      `3`,
      `5`
    ],
  },
  {
    id: 14,
    text: `If -1 < x < 5, then which of the following must be true?`,
    options: [
      `|3 - x| < -3`,
      `|x| < 4`,
      `|x| - 2 > 2`,
      `|2 + x| > 3`,
      `|x - 2| < 3`
    ],
  },
  {
    id: 15,
    text: `Is K a positive number? (1) |K^3| + 1 > K  (2) K + 1 > |K^3|`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 17,
    text: `Set T contains more than one element. Is the median of set T greater than its mean? (1) Set T has positive range. (2) The elements of the set are not consecutive integers`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 18,
    text: `Set S consists of N elements. If N > 2, what is the standard deviation of S? (1) The mean and median of the set are equal. (2) The difference between any two elements of the set is equal.`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 19,
    text: `Is the mean of set S greater than its median? (1) All members of S are consecutive multiples of 3. (2) The sum of all members of S equals 75.`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 20,
    text: `If a, b & c are integers and a < b < c, are a, b, c consecutive integers? (1) The median of {a!, b!, c!} is an odd number. (2) c! is a prime number.`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 21,
    text: `A set of 11 different integers has a median of 25 and a range of 50. What is the greatest possible integer that could be in this set?`,
    options: [
      `65`,
      `70`,
      `75`,
      `80`,
      `85`
    ],
  },
  {
    id: 22,
    text: `Out of 100 people surveyed, 60 were women. If 10 were smoking women and 20 were smoking men, what percentage of men surveyed were non-smokers?`,
    options: [
      `10`,
      `20`,
      `30`,
      `40`,
      `50`
    ],
  },
  {
    id: 24,
    text: `A bus from city M is traveling to city N at a constant speed while another bus makes the same journey in the opposite direction at the same speed. They meet at point P after 2 hours. The next day one bus is delayed 24 minutes and the other leaves 36 minutes earlier. If they meet 24 miles from point P, what is the distance between the two cities?`,
    options: [
      `48`,
      `72`,
      `96`,
      `120`,
      `192`
    ],
  },
  {
    id: 25,
    text: `A train is traveling at a constant speed
and after making three one-hour stops
reaches its destination. After waiting an
hour it makes a return journey stopping a
total of ten times, thirty minutes each but
traveling at twice the speed. If both trips
took the same amount of time, how many
hours was the roundtrip?`,
    options: [
      `14`,
      `15`,
      `16`,
      `17`,
      `18`
    ],
  },
  {
    id: 26,
    text: `A cook went to a market to buy some eggs and paid $12. But since the eggs were quite small, he talked the seller into adding two more eggs, free of charge. As the two eggs were added, the price per dozen went down by a dollar. How many eggs did the cook bring home from the market?`,
    options: [
      `8`,
      `12`,
      `15`,
      `16`,
      `18`
    ],
  },
  {
    id: 27,
    text: `It takes computer A 6 hours and 40 minutes to finish a job. Computer B can process the same job in 10 hours. How long will it take both computers working together to finish the job?`,
    options: [
      `6 hours and 20 minutes`,
      `5 hours and 10 minutes`,
      `4 hours and 40 minutes`,
      `4 hours`,
      `3 hours and 20 minutes`
    ],
  },
  {
    id: 28,
    text: `Workers A, B, and C can complete a task in 10, 5, and x hours respectively. A starts alone, B joins 2 hours later, C joins 2 hours after that, and A, B, C together finish in 15 minutes. What is x?`,
    options: [
      `1`,
      `1.25`,
      `2`,
      `2.5`,
      `4`
    ],
  },
  {
    id: 29,
    text: `Mac finishes a job in M days, Jack in J days. After working together T days, Mac left and Jack finished in R days. If both completed equal amounts of work, how many days would Jack need alone for the entire job? (1) M = 20 days  (2) R = 10 days`,
    options: [
      `Statement (1) ALONE is sufficient, but Statement (2) ALONE is not sufficient`,
      `Statement (2) ALONE is sufficient, but Statement (1) ALONE is not sufficient`,
      `BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient`,
      `EACH statement ALONE is sufficient`,
      `Statements (1) and (2) TOGETHER are NOT sufficient`
    ],
  },
  {
    id: 30,
    text: `Painters A and B can paint a house alone in 20 and 30 days. They started together, A left for some days, then B worked alone for 5 days, then A and B together finished in 4 days. After how many days of working together did A leave?`,
    options: [
      `4`,
      `5`,
      `6`,
      `7`,
      `8`
    ],
  },
  {
    id: 31,
    text: `How many liters of pure alcohol must be added to a 40-liter solution that is 10% alcohol in order to double the alcohol proportion?`,
    options: [
      `4`,
      `5`,
      `10`,
      `20`,
      `40`
    ],
  },
  {
    id: 32,
    text: `A Food and Drug lab has two new samples: a 240 gram cup of drip coffee, which contains 124 mg of caffeine, and a 60 gram cup of espresso, containing 160 mg of caffeine. If a technician were to combine the two drinks so that the new mixture contained 50% coffee and 50% espresso, how many mg of caffeine would the new drink contain?`,
    options: [
      `111`,
      `121`,
      `144`,
      `191`,
      `382`
    ],
  },
];

export const GMAT_DURATION_MINUTES = 45;
