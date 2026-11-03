// Shapes of the game data, shared by the plain data files and the game kit.

// A card to answer with one of a few fixed choices.
export type Card<K extends string> = { text: string; answer: K; why: string };
export type Choice<K extends string> = { key: K; name: string; note?: string };

// A question with its own answers.
export type Question = { text: string; options: { text: string; right?: boolean; why: string }[] };
