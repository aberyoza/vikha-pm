import Link from "next/link";
import { RATE, dpp, irr, npv, pi } from "@/content/examples/game-studio";
import { Figure } from "./figure";
import { MindMap, type MapBranch } from "./mind-map";

const m3 = (slug: string) => `/modules/module-03/${slug}`;
const m4 = (slug: string) => `/modules/module-04/${slug}`;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const dec = (v: number) =>
  new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

const module3Branches: MapBranch[] = [
  {
    tag: "Урок 1",
    title: "Навіщо рахувати проєкт",
    href: m3("project-analysis"),
    leaves: [
      { label: "Чотири питання", note: "чи вийде, чи користуватимуться, чи окупиться, що може піти не так" },
      { label: "Реальні інвестиції", note: "розробка, команда, сервери" },
      { label: "Фінансові інвестиції", note: "акції, облігації" },
    ],
  },
  {
    tag: "Урок 2",
    title: "П'ять принципів",
    href: m3("principles-aspects"),
    leaves: [
      { label: "Альтернативна вартість", note: "що втрачаємо, обравши цей проєкт" },
      { label: "Рахуємо різницю", note: "5,3 − 5 = 0,3 млн грн вигоди" },
      { label: "З усіх боків, час, ризики" },
    ],
  },
  {
    tag: "Урок 2",
    title: "Сім питань до проєкту",
    href: m3("principles-aspects"),
    leaves: [
      { label: "Технічне і комерційне", note: "чи зробимо, чи купуватимуть" },
      { label: "Інституційне і соціальне", note: "хто, за якими правилами, вплив на людей" },
      { label: "Екологічне, фінансове, економічне" },
    ],
  },
  {
    tag: "Урок 3",
    title: "Зв'язки і горизонт",
    href: m3("horizon"),
    leaves: [
      { label: "П'ять типів зв'язків", note: "від взаємовиключних до заміщуючих" },
      { label: "Горизонт планування", note: "в IT зазвичай 3–5 років" },
    ],
  },
  {
    tag: "Урок 4",
    title: "Гроші й час",
    href: m3("time-value"),
    leaves: [
      { label: "Сьогодні дорожче, ніж завтра", note: "інфляція, ризик, можливості" },
      { label: "Нарощення і дисконтування", note: "гроші вперед і назад у часі" },
      { label: "1,2 млн за 4 роки", note: "лише ≈ 0,95 млн у сьогоднішніх грошах" },
    ],
  },
];

export function Module3Map() {
  return (
    <MindMap
      title="Карта модуля 3"
      lead="Усе, що треба знати, перш ніж вкладати гроші в проєкт."
      center="Чи варто вкладатися?"
      centerNote="Магазин вирішує, чи робити мобільний застосунок"
      branches={module3Branches}
      caption="Натисніть на назву гілки, щоб повернутися до уроку."
    />
  );
}

const module4Branches: MapBranch[] = [
  {
    tag: "Урок 1",
    title: "Витрати і вигоди",
    href: m4("costs-benefits"),
    leaves: [
      { label: "Спочатку мінус, потім плюс", note: "−300, далі 120, 130, 115, 80" },
      { label: "Резерв 7–12%", note: "на несподіванки" },
      { label: "Утоплені витрати", note: "не рахуємо: 300, а не 350" },
      { label: "Амортизація", note: "«паперові» гроші" },
    ],
  },
  {
    tag: "Урок 2",
    title: "Чотири показники",
    href: m4("criteria"),
    leaves: [
      { label: "NPV", note: `+${Math.round(npv(RATE))} тис. грн — вигідно, бо більше 0` },
      { label: "IRR", note: `≈ ${pct(irr())} — більша за ставку ${pct(RATE)}` },
      { label: "PI", note: `${dec(pi())} грн на кожну вкладену гривню` },
      { label: "DPP", note: `окупається за ≈ ${Math.round(dpp())} роки` },
    ],
  },
  {
    tag: "Урок 3",
    title: "Касовий розрив",
    href: m4("cash-gap"),
    leaves: [
      { label: "Три кошики", note: "інвестиційний, операційний, фінансовий" },
      { label: "Залишок ≥ 0", note: "на кожному кроці" },
      { label: "Кредит 200 тис.", note: "закриває розрив на старті" },
    ],
  },
  {
    tag: "Модуль 3",
    title: "На чому це тримається",
    href: m3("time-value"),
    leaves: [
      { label: "Дисконтування", note: "основа всіх чотирьох показників" },
      { label: "Горизонт планування", note: "межа для строку окупності" },
      { label: "Принцип «час і запас грошей»", note: "звідси перевірка касового розриву" },
    ],
  },
];

export function Module4Map() {
  return (
    <MindMap
      title="Карта модуля 4"
      lead="Від витрат до рішення: як порахувати, чи окупиться проєкт."
      center="Чи окупиться проєкт?"
      centerNote="Студія робить мобільну гру за 300 тис. грн"
      branches={module4Branches}
      caption="Натисніть на назву гілки, щоб повернутися до уроку."
    />
  );
}

const decisionSteps = [
  { label: "Ідея", note: "мобільна гра", href: m4("costs-benefits") },
  { label: "Проєктний аналіз", note: "чотири питання", href: m3("project-analysis") },
  { label: "Грошовий потік", note: "лише реальні гроші", href: m4("costs-benefits") },
  { label: "Сьогоднішні гроші", note: "дисконтування", href: m3("time-value") },
  { label: "Чотири показники", note: "NPV, IRR, PI, DPP", href: m4("criteria") },
  { label: "Касовий розрив", note: "залишок ≥ 0", href: m4("cash-gap") },
  { label: "Рішення", note: "запускати чи ні", href: m4("criteria") },
];

// The money decision across modules 3 and 4 as one path.
export function MoneyDecisionPath() {
  return (
    <Figure
      title="Шлях рішення про гроші"
      lead="Модулі 3 і 4 — це один шлях від ідеї до рішення."
      caption="Кожен крок веде до уроку, де його розібрано."
    >
      <ol className="grid gap-2 @2xl:grid-cols-7">
        {decisionSteps.map((step, i) => (
          <li key={step.label} className="relative">
            <Link
              href={step.href}
              className={`flex h-full items-center gap-3 rounded-[4px] border p-3 transition-colors duration-200 hover:border-accent @2xl:flex-col @2xl:items-start @2xl:gap-1 ${
                i === decisionSteps.length - 1 ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
            >
              <span className="font-display text-sm font-semibold text-accent tabular-nums">{i + 1}</span>
              <span>
                <span className="block text-sm leading-snug font-medium">{step.label}</span>
                <span className="block text-[12px] leading-snug text-muted">{step.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
