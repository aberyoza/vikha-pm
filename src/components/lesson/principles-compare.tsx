import { Figure } from "./figure";

const pmbok7 = [
  "Бути старанним, шанобливим і турботливим",
  "Створювати команді середовище для співпраці",
  "Ефективно залучати зацікавлені сторони",
  "Зосереджуватися на цінності",
  "Бачити системні взаємодії й реагувати на них",
  "Демонструвати лідерську поведінку",
  "Адаптувати підхід до контексту",
  "Вбудовувати якість у процеси й результати",
  "Долати складність",
  "Оптимізувати реагування на ризики",
  "Обирати адаптивність і стійкість",
  "Уможливлювати зміни заради бажаного майбутнього",
];

const pmbok8 = [
  { name: "Цілісний погляд", note: "бачити проєкт як систему, а не набір окремих задач" },
  { name: "Зосередженість на цінності", note: "кожне рішення — заради користі для людей і бізнесу" },
  { name: "Вбудована якість", note: "закладати якість із самого початку, а не перевіряти наприкінці" },
  { name: "Відповідальне лідерство", note: "чесність, турбота про команду, етика" },
  { name: "Сталий розвиток", note: "зважати на вплив на людей, довкілля й економіку" },
  { name: "Культура довіри", note: "команда має право й безпеку ухвалювати рішення" },
];

// PMBOK 7's twelve principles next to PMBOK 8's six.
export function PrinciplesCompare() {
  return (
    <Figure
      title="Принципи управління проєктами"
      lead="12 принципів PMBOK 7 у PMBOK 8 стиснули до 6."
      caption="Принципи не кажуть, які документи заповнити. Вони описують, як поводиться хороша команда й менеджер, — у будь-якому проєкті й за будь-якого підходу."
    >
      <div className="grid gap-4 @2xl:grid-cols-2">
        <div className="rounded-[4px] border border-border p-4">
          <p className="font-medium">PMBOK 7 — 12 принципів</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted marker:text-accent">
            {pmbok7.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-[4px] bg-accent-soft p-4">
          <p className="font-medium">PMBOK 8 — 6 принципів</p>
          <ol className="mt-2 space-y-2 text-sm">
            {pmbok8.map((p, i) => (
              <li key={p.name}>
                <span className="font-display font-semibold text-accent">{i + 1}.</span>{" "}
                <span className="font-medium">{p.name}</span>
                <span className="block text-[13px] text-muted">{p.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Figure>
  );
}
