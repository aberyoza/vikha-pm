// Module 3 assignment: the simulator «Реліз за 12 тижнів». The player picks an
// approach and how much process, then lives with the consequences through one
// project. Two missions: high uncertainty (a game) and low uncertainty with a
// regulator (a hospital app), so no approach wins everywhere.

export const TITLE = "Реліз за 12 тижнів";
export const INTRO =
  "Ти ведеш проєкт від старту до релізу. Обираєш підхід і скільки процесу, а далі дивишся, що з цього вийде. Дві місії по 4–5 хвилин, і кожну можна переграти іншим підходом. Наприкінці буде друга віха твого проєкту.";

export type Approach = "predictive" | "hybrid" | "adaptive";
export type Process = "light" | "formal";

export const APPROACHES: { key: Approach; name: string; note: string }[] = [
  { key: "predictive", name: "Предиктивний", note: "Усе планують на початку й ідуть етапами. Результат видно наприкінці." },
  { key: "hybrid", name: "Гібридний", note: "Передбачуване планують наперед, а невизначене роблять короткими ітераціями." },
  {
    key: "adaptive",
    name: "Адаптивний",
    note: "Короткі ітерації по 1–4 тижні. Після кожної є інкремент — готова частина продукту, відгук і новий план.",
  },
];

export const PROCESSES: { key: Process; name: string; note: string }[] = [
  {
    key: "light",
    name: "Легко",
    note: "Мінімум документів, звіти усно на стендапі. Швидко, але вразливо, коли щось ламається.",
  },
  {
    key: "formal",
    name: "Формально",
    note: "Документи, письмові звіти, рада змін. Тиждень накладних витрат, зате все записано.",
  },
];

export const PLAN_WEEKS = 12;
// Release by this week still counts as on time: a week of slack is normal.
export const LATE_AFTER = 14;

export type Sim = {
  approach: Approach;
  process: Process;
  delay: number;
  morale: number;
  // Players' or client's satisfaction; hidden until the approach shows it.
  meter: number;
  seen: boolean;
  found: boolean;
  fixed: boolean;
  storeRisk: boolean;
  stopped: boolean;
  // What shaped the result, shown on the mission result screen.
  notes: string[];
};

export type Option = { label: string; apply: (s: Sim) => { s: Sim; outcome: string } };

export type Moment = {
  week: number;
  area: string;
  title: string;
  // State changes that happen as the moment starts, before the choice.
  enter?: (s: Sim) => Sim;
  text: (s: Sim) => string;
  options: (s: Sim) => Option[];
};

export type Mission = {
  name: string;
  brief: string;
  meterName: string;
  meterHidden: string;
  start: number;
  thresholds: [number, number];
  moments: Moment[];
  release?: (s: Sim) => Sim;
  moral: string;
};

const note = (s: Sim, text: string): Sim => ({ ...s, notes: [...s.notes, text] });
const by = <T>(a: Approach, v: Record<Approach, T>) => v[a];

const PLANNED: Record<Approach, string> = {
  predictive: "Розписали всю роботу, дизайн і графік до релізу наперед.",
  hybrid: "Бюджет і дату релізу зафіксували, а невизначене робитимете двотижневими спринтами з демо.",
  adaptive: "Склали беклог і план на перший спринт. Демо — кожні два тижні.",
};
const FORMAL_TEXT = " Процес формальний: рішення і код документуєте, щотижня пишете звіт. Це коштує тиждень.";

const start: Moment = {
  week: 0,
  area: "Ініціація і планування",
  title: "Старт проєкту",
  text: (s) => PLANNED[s.approach] + (s.process === "formal" ? FORMAL_TEXT : ""),
  options: () => [
    {
      label: "Почати роботу",
      apply: (s) => ({ s: s.process === "formal" ? { ...s, delay: s.delay + 1 } : s, outcome: "" }),
    },
  ],
};

export const MISSIONS: Mission[] = [
  {
    name: "Головоломка про котів",
    brief:
      "Студія робить мобільну головоломку. Що сподобається гравцям, наперед не знає ніхто. План — реліз на 12-му тижні.",
    meterName: "Гравці",
    meterHidden: "дізнаєшся, коли гравці побачать гру",
    start: 50,
    thresholds: [60, 80],
    moments: [
      start,
      {
        week: 4,
        area: "Контрольна точка",
        title: "Контрольна точка після прототипу",
        enter: (s) => (s.approach === "predictive" ? s : { ...s, seen: true, found: true }),
        text: (s) =>
          s.approach === "predictive"
            ? "Внутрішні тести пройдено, план виконано на 30%. Гравці гру ще не бачили. Ти спонсор: що далі?"
            : "Демо для 20 гравців: механіка подобається, але майже всі скаржаться на незручне управління. Ти спонсор: що далі?",
        options: () => [
          {
            label: "Іти далі",
            apply: (s) => ({
              s,
              outcome: s.found
                ? "Команда йде далі з незручним управлінням. Проблема нікуди не поділася."
                : "Ідете за планом.",
            }),
          },
          {
            label: "Змінити курс",
            apply: (s) =>
              s.found
                ? {
                    s: note(
                      { ...s, delay: s.delay + 1, meter: s.meter + 30, fixed: true },
                      "Управління виправили на 4-му тижні, поки це коштувало лише тиждень.",
                    ),
                    outcome: "Тиждень на нове управління. Гравцям воно подобається значно більше.",
                  }
                : {
                    s: note({ ...s, delay: s.delay + 1 }, "Тиждень пішов на зміни наосліп: даних від гравців не було."),
                    outcome: "Без відгуку гравців незрозуміло, що міняти. Команда тиждень переробляє дрібниці.",
                  },
          },
          {
            label: "Зупинити",
            apply: (s) => ({
              s: note(
                { ...s, stopped: true },
                s.found
                  ? "Гру зупинили, хоча механіка гравцям подобалась: управління можна було виправити."
                  : "Проєкт зупинили без жодних даних від гравців.",
              ),
              outcome: "Проєкт зупинено.",
            }),
          },
        ],
      },
      {
        week: 6,
        area: "Виконання",
        title: "Нові правила магазину",
        text: () => "Магазин застосунків змінив правила покупок. Гру з покупками за старими правилами не пропустять.",
        options: () => [
          {
            label: "Внести зміну зараз",
            apply: (s) => {
              const cost = by(s.approach, { predictive: 2, hybrid: 1, adaptive: 0 });
              const outcome = by(s.approach, {
                predictive: "Зміна йде через раду змін: переписати план, дизайн і графік. Мінус 2 тижні.",
                hybrid: "Зміну вбудували в найближчий спринт, але план довелося переглянути. Мінус тиждень.",
                adaptive: "Зміну поклали в наступний спринт замість менш важливої задачі. Строк не зсунувся.",
              });
              const next = { ...s, delay: s.delay + cost };
              return {
                s: cost >= 2 ? note(next, "Зміна правил посеред предиктивного плану коштувала 2 тижні.") : next,
                outcome,
              };
            },
          },
          {
            label: "Сподіватися, що перевірка пропустить",
            apply: (s) => ({ s: { ...s, storeRisk: true }, outcome: "Працюєте далі, ніби нічого не сталося." }),
          },
        ],
      },
      {
        week: 8,
        area: "Виконання",
        title: "Програміст захворів",
        text: () => "Головний програміст захворів на тиждень.",
        options: () => [
          {
            label: "Почекати",
            apply: (s) => ({ s: { ...s, delay: s.delay + 1 }, outcome: "Робота над механікою стоїть тиждень." }),
          },
          {
            label: "Передати задачі колезі",
            apply: (s) =>
              s.process === "formal"
                ? {
                    s: note(s, "Формальний процес окупився: хвороба програміста майже не затримала гру."),
                    outcome: "Код і рішення задокументовані, тож колега підхопив за день.",
                  }
                : {
                    s: { ...s, delay: s.delay + 1, morale: s.morale - 15 },
                    outcome: "Без документації колега тиждень розбирається в чужому коді і злиться.",
                  },
          },
          {
            label: "Наздогнати у вихідні",
            apply: (s) => ({
              s: note({ ...s, morale: s.morale - 20 }, "Вихідні зберегли строк, але з'їли дух команди."),
              outcome: "Встигли, але команда втомлена.",
            }),
          },
        ],
      },
      {
        week: 10,
        area: "Моніторинг і контроль",
        title: "Гра в руках гравців",
        enter: (s) => (s.approach === "predictive" ? { ...s, seen: true, found: true } : s),
        text: (s) =>
          s.approach === "predictive"
            ? "Перше тестування всієї гри з гравцями. Вони скаржаться на незручне управління."
            : s.fixed
              ? "Демо: гравцям подобається. Вони просять ще режим на час."
              : "Демо: гравці досі скаржаться на управління.",
        options: (s) =>
          s.fixed
            ? [
                {
                  label: "Додати режим на час",
                  apply: (x) => ({
                    s: { ...x, delay: x.delay + 1, meter: x.meter + 5 },
                    outcome: "Режим готовий за тиждень, гравцям подобається.",
                  }),
                },
                {
                  label: "Лишити на оновлення",
                  apply: (x) => ({
                    s: note(x, "Режим на час лишили на оновлення: не все з побажань однаково цінне."),
                    outcome: "Режим піде в перше оновлення. Реліз за планом.",
                  }),
                },
              ]
            : [
                {
                  label: "Переробити управління",
                  apply: (x) =>
                    x.approach === "predictive"
                      ? {
                          s: note(
                            { ...x, delay: x.delay + 4, meter: x.meter + 20 },
                            "Про управління дізналися лише на 10-му тижні: переробка коштувала 4 тижні.",
                          ),
                          outcome: "Гру вже зібрано, тож переробка зачіпає все. Чотири тижні.",
                        }
                      : {
                          s: note(
                            { ...x, delay: x.delay + 2, meter: x.meter + 25 },
                            "Управління виправили на 10-му тижні: 2 тижні замість одного на контрольній точці.",
                          ),
                          outcome: "Два тижні на нове управління.",
                        },
                },
                {
                  label: "Випустити як є",
                  apply: (x) => ({
                    s: note({ ...x, meter: x.meter - 25 }, "Гра вийшла з незручним управлінням, і гравці це помітили."),
                    outcome: "Реліз за планом, але з відомою проблемою.",
                  }),
                },
              ],
      },
    ],
    release: (s) =>
      s.storeRisk
        ? note({ ...s, delay: s.delay + 3 }, "Магазин відхилив гру за новими правилами: ще 3 тижні на виправлення.")
        : s,
    moral:
      "Тут багато невизначеності: виграє той, хто рано показує гру гравцям і швидко змінює план. Адаптивний і гібридний підходи дають відгук на 4-му тижні, а не на 10-му.",
  },
  {
    name: "Застосунок для лікарні",
    brief:
      "Запис до лікаря для мережі лікарень. Вимоги описані в медичному стандарті, є регулятор і штрафи. План — реліз на 12-му тижні.",
    meterName: "Лікарі",
    meterHidden: "дізнаєшся, коли лікарі побачать застосунок",
    start: 70,
    thresholds: [60, 75],
    moments: [
      {
        ...start,
        enter: (s) => (s.approach === "adaptive" ? s : { ...s, meter: s.meter + 10 }),
        text: (s) =>
          (s.approach === "adaptive"
            ? PLANNED.adaptive
            : "Вимоги з медичного стандарту розписали наперед, лікарі погодили всі екрани." +
              (s.approach === "hybrid" ? " Раз на місяць показуватимете лікарям нові екрани." : "")) +
          (s.process === "formal" ? FORMAL_TEXT : ""),
      },
      {
        week: 4,
        area: "Контрольна точка",
        title: "Контрольна точка після проєктування",
        enter: (s) =>
          s.approach === "adaptive"
            ? note(
                { ...s, seen: true, delay: s.delay + 1, meter: s.meter - 10 },
                "Лікарі не мають часу на демо кожні два тижні: зустрічі з'їли тиждень.",
              )
            : { ...s, seen: true },
        text: (s) =>
          "Вимоги стандарту покрито повністю, архітектура готова." +
          (s.approach === "adaptive"
            ? " Але лікарям незручно приходити на демо кожні два тижні: кожну зустріч чекаєте по кілька днів."
            : "") +
          " Ти спонсор: що далі?",
        options: () => [
          { label: "Іти далі", apply: (s) => ({ s, outcome: "Ідете за планом." }) },
          {
            label: "Змінити курс",
            apply: (s) => ({
              s: note({ ...s, delay: s.delay + 1 }, "Курс змінювали без причини: вимоги були стабільні."),
              outcome: "Міняти нема чого: вимоги стабільні. Тиждень пішов на наради.",
            }),
          },
          {
            label: "Зупинити",
            apply: (s) => ({
              s: note({ ...s, stopped: true }, "Зупинили проєкт, який ішов за планом."),
              outcome: "Проєкт зупинено.",
            }),
          },
        ],
      },
      {
        week: 6,
        area: "Виконання",
        title: "Нове побажання",
        text: () => "Лікар просить додати чат з пацієнтом. У стандарті його немає.",
        options: () => [
          {
            label: "Додати зараз",
            apply: (s) => {
              const cost = by(s.approach, { predictive: 3, hybrid: 2, adaptive: 1 });
              return {
                s: note(
                  { ...s, delay: s.delay + cost, meter: s.meter + 10 },
                  `Чат додали посеред проєкту: ще ${cost} ${cost === 1 ? "тиждень" : "тижні"} на розробку й сертифікацію.`,
                ),
                outcome: "Нова функція — це ще й нова сертифікація.",
              };
            },
          },
          {
            label: "Записати на наступну версію",
            apply: (s) => ({
              s: { ...s, meter: s.meter - 5 },
              outcome: "Лікар трохи розчарований, але реліз не зсувається.",
            }),
          },
        ],
      },
      {
        week: 8,
        area: "Моніторинг і контроль",
        title: "Перевірка регулятора",
        text: () => "Регулятор просить показати документацію всіх рішень і змін.",
        options: (s) =>
          s.process === "formal"
            ? [
                {
                  label: "Показати документи як є",
                  apply: (x) => ({
                    s: note(x, "Формальний процес окупився: регулятор отримав документи одразу."),
                    outcome: "Документи вже є, перевірка пройшла за день.",
                  }),
                },
                {
                  label: "Спершу переписати їх начисто",
                  apply: (x) => ({
                    s: note({ ...x, delay: x.delay + 1 }, "Документи переписували начисто, хоча вони вже були: зайвий тиждень."),
                    outcome: "Тиждень на красиві документи. Регулятор прийняв би й ті, що були.",
                  }),
                },
              ]
            : [
                {
                  label: "Писати документи заднім числом",
                  apply: (x) => ({
                    s: note(
                      { ...x, delay: x.delay + 3, morale: x.morale - 15 },
                      "Документи писали заднім числом: 3 тижні і злість команди.",
                    ),
                    outcome: "Три тижні команда згадує, хто і чому що вирішив.",
                  }),
                },
                {
                  label: "Попросити відстрочку",
                  apply: (x) => ({
                    s: note(
                      { ...x, delay: x.delay + 2, meter: x.meter - 10 },
                      "Відстрочка в регулятора зсунула реліз і розчарувала лікарів.",
                    ),
                    outcome: "Регулятор дав два тижні, а лікарі незадоволені затримкою.",
                  }),
                },
              ],
      },
      {
        week: 10,
        area: "Моніторинг і контроль",
        title: "Перед релізом",
        enter: (s) =>
          s.approach === "adaptive"
            ? note({ ...s, delay: s.delay + 1, meter: s.meter - 10 }, "Ще одне демо: лікарі втомилися від зустрічей.")
            : s.approach === "hybrid"
              ? note({ ...s, delay: s.delay + 1, meter: s.meter - 5 }, "Щомісячне демо змусило переробити два екрани.")
              : s,
        text: (s) =>
          (s.approach === "adaptive"
            ? "Ще одне демо: лікарі приходять неохоче і просять дрібні зміни, це ще тиждень. "
            : s.approach === "hybrid"
              ? "Щомісячне демо: лікарі просять переробити два екрани, хоча погодили їх на старті, це ще тиждень. "
              : "") +
          "Повне тестування за стандартом знайшло помилку: у рідкісних випадках запис до лікаря дублюється.",
        options: () => [
          {
            label: "Виправити до релізу",
            apply: (s) => ({
              s: note({ ...s, delay: s.delay + 1 }, "Помилку з дублюванням виправили до релізу: тиждень, і регулятор спокійний."),
              outcome: "Тиждень на виправлення і повторне тестування.",
            }),
          },
          {
            label: "Випустити, виправити в оновленні",
            apply: (s) => ({
              s: note(
                { ...s, delay: s.delay + 3, meter: s.meter - 10 },
                "Регулятор знайшов відому помилку і зупинив запуск на 3 тижні.",
              ),
              outcome: "Регулятор перевіряє реліз і бачить помилку в записі. Запуск зупинено, поки не виправите.",
            }),
          },
        ],
      },
    ],
    moral:
      "Тут вимоги стабільні, а регулятор суворий: виграють план наперед і документи. Часті демо лише забирають час у лікарів.",
  },
];

export const newSim = (m: Mission, approach: Approach, process: Process): Sim => ({
  approach,
  process,
  delay: 0,
  morale: 70,
  meter: m.start,
  seen: false,
  found: false,
  fixed: false,
  storeRisk: false,
  stopped: false,
  notes: [],
});

// Five stars: released, two satisfaction thresholds, on time, team in shape.
export function rate(m: Mission, s: Sim) {
  if (s.stopped) return { stars: 1, checks: [] as { ok: boolean; text: string }[] };
  const week = PLAN_WEEKS + s.delay;
  const checks = [
    { ok: true, text: "Реліз відбувся" },
    { ok: s.meter >= m.thresholds[0], text: `${m.meterName} задоволені: ${s.meter}% з потрібних ${m.thresholds[0]}%` },
    { ok: s.meter >= m.thresholds[1], text: `${m.meterName} в захваті: потрібно ${m.thresholds[1]}%` },
    { ok: week <= LATE_AFTER, text: `Реліз на ${week}-му тижні, вчасно — до ${LATE_AFTER}-го` },
    { ok: s.morale >= 50, text: `Дух команди ${s.morale}%, потрібно щонайменше 50%` },
  ];
  return { stars: checks.filter((c) => c.ok).length, checks };
}

export const MAX_DIAMONDS = MISSIONS.length * 5;
