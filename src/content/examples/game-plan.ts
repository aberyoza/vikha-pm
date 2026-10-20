// Running example for module 5: the studio from module 4 plans the work on
// its mobile game. Durations are in weeks. All module 5 figures derive their
// numbers from here, so text, network diagrams and the Gantt chart agree.

export type Task = {
  id: number;
  // Short label for diagram nodes.
  name: string;
  // Full wording for lists and tables.
  title: string;
  weeks: number;
  after: number[];
};

export const TASKS: Task[] = [
  { id: 1, name: "Концепція", title: "Концепція гри", weeks: 2, after: [] },
  { id: 2, name: "Дизайн", title: "Дизайн персонажів і світу", weeks: 4, after: [1] },
  { id: 3, name: "Механіка", title: "Ігрова механіка (код)", weeks: 5, after: [1] },
  { id: 4, name: "Сервер", title: "Сервер і таблиця рекордів", weeks: 3, after: [1] },
  { id: 5, name: "Рівні", title: "Збирання 20 рівнів", weeks: 3, after: [2, 3] },
  { id: 6, name: "Маркетинг", title: "Сторінка гри в магазині застосунків", weeks: 2, after: [2] },
  { id: 7, name: "Тестування", title: "Тестування на телефонах", weeks: 2, after: [4, 5] },
  { id: 8, name: "Реліз", title: "Реліз в App Store і Google Play", weeks: 1, after: [6, 7] },
];

export type Scheduled = Task & {
  es: number; // early start
  ef: number; // early finish
  ls: number; // late start
  lf: number; // late finish
  slack: number;
  critical: boolean;
};

export const successors = (id: number, tasks = TASKS) =>
  tasks.filter((t) => t.after.includes(id)).map((t) => t.id);

// Critical path method. Tasks are numbered so that every task comes after
// all of its predecessors, so one pass in each direction is enough.
export function schedule(tasks = TASKS) {
  const byId = new Map<number, Scheduled>();

  for (const t of tasks) {
    const es = Math.max(0, ...t.after.map((p) => byId.get(p)!.ef));
    byId.set(t.id, { ...t, es, ef: es + t.weeks, ls: 0, lf: 0, slack: 0, critical: false });
  }

  const total = Math.max(...[...byId.values()].map((t) => t.ef));

  for (const t of [...tasks].reverse()) {
    const s = byId.get(t.id)!;
    const next = successors(t.id, tasks);
    s.lf = next.length ? Math.min(...next.map((n) => byId.get(n)!.ls)) : total;
    s.ls = s.lf - s.weeks;
    s.slack = s.ls - s.es;
    s.critical = s.slack === 0;
  }

  return { tasks: tasks.map((t) => byId.get(t.id)!), total };
}

export const PLAN = schedule();

export const weeks = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} тиждень`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} тижні`;
  return `${n} тижнів`;
};
