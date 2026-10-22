// Running example for module 5: who surrounds the game studio's project.
// The register, the power/interest grid and the engagement matrix all read
// from this list, so they always agree.

export type Level = "high" | "low";

export const ENGAGEMENT = ["Не обізнаний", "Чинить опір", "Нейтральний", "Підтримує", "Веде"] as const;
export type Engagement = 0 | 1 | 2 | 3 | 4;

export type Stakeholder = {
  key: string;
  name: string;
  side: "internal" | "external";
  expects: string;
  power: Level;
  interest: Level;
  // Current and desired engagement for the key stakeholders.
  current?: Engagement;
  desired?: Engagement;
};

export const STAKEHOLDERS: Stakeholder[] = [
  {
    key: "founders",
    name: "Засновники студії",
    side: "internal",
    expects: "гра окупиться, студія зросте",
    power: "high",
    interest: "high",
    current: 4,
    desired: 4,
  },
  { key: "team", name: "Команда", side: "internal", expects: "цікава робота, реальні строки", power: "high", interest: "high" },
  { key: "accountant", name: "Бухгалтер на аутсорсі", side: "internal", expects: "вчасні документи", power: "low", interest: "low" },
  {
    key: "beta",
    name: "Гравці з бета-тесту",
    side: "external",
    expects: "цікава гра, їхні відгуки чують",
    power: "low",
    interest: "high",
    current: 2,
    desired: 4,
  },
  { key: "community", name: "Спільнота в Discord", side: "external", expects: "новини, конкурси, спілкування", power: "low", interest: "high" },
  { key: "streamer", name: "Стример-партнер", side: "external", expects: "якісна гра для ефіру, частка доходу", power: "low", interest: "high" },
  {
    key: "parents",
    name: "Батьки гравців",
    side: "external",
    expects: "безпечна гра, чесні покупки",
    power: "low",
    interest: "low",
    current: 0,
    desired: 2,
  },
  {
    key: "stores",
    name: "App Store і Google Play",
    side: "external",
    expects: "гра за правилами, комісія з продажів",
    power: "high",
    interest: "low",
    current: 0,
    desired: 2,
  },
  {
    key: "bank",
    name: "Банк",
    side: "external",
    expects: "кредит повернуть вчасно",
    power: "high",
    interest: "high",
    current: 2,
    desired: 3,
  },
  { key: "tax", name: "Податкова", side: "external", expects: "податки сплачені", power: "high", interest: "low" },
  { key: "rivals", name: "Конкуренти", side: "external", expects: "щоб гра не забрала їхніх гравців", power: "low", interest: "low" },
];

export const QUADRANTS = {
  "high-high": {
    name: "Активно керувати",
    how: "тісна співпраця і участь у ключових рішеннях",
  },
  "high-low": {
    name: "Тримати задоволеними",
    how: "коротко й вчасно інформувати, не перевантажувати подробицями",
  },
  "low-high": {
    name: "Інформувати",
    how: "регулярно ділитися новинами і слухати відгуки",
  },
  "low-low": {
    name: "Стежити",
    how: "мінімум зусиль, перевіряти час від часу",
  },
} as const;

export const quadrantOf = (s: Stakeholder) => QUADRANTS[`${s.power}-${s.interest}`];
