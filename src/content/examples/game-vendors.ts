// Running example for module 10: three sound studios bidding to voice the game.
// Scores from 1 to 10 for each criterion.

export const CRITERIA = [
  { key: "price", label: "Ціна" },
  { key: "quality", label: "Якість" },
  { key: "time", label: "Строки" },
] as const;

export type Criterion = (typeof CRITERIA)[number]["key"];

export const VENDORS: { name: string; offer: string; scores: Record<Criterion, number> }[] = [
  { name: "Студія «Тиша»", offer: "30 тис., 3 тижні", scores: { price: 9, quality: 6, time: 8 } },
  { name: "Студія «Ехо»", offer: "45 тис., 4 тижні", scores: { price: 6, quality: 9, time: 7 } },
  { name: "Студія «Відлуння»", offer: "38 тис., 5 тижнів", scores: { price: 7, quality: 8, time: 5 } },
];
