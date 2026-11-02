// Module 9 game «Де гроші?»: the money of the cat game from the first rough
// figure to the crisis meeting. Name a range, keep the account above zero, count
// honest progress, read the reports and steer the forecast. Numbers come from
// the lesson's budget.
import { BAC, BUDGET, CONTINGENCY, COSTS, PV_CURVE, STATUS } from "@/content/examples/game-finance";

export const TITLE = "Де гроші?";

export const INTRO =
  "Гра про котів коштує 300 тис. грн. Але звідки ця цифра і чи вистачить її до релізу? Оціни вартість, склади бюджет, порахуй, скільки команда справді зробила, і проведи кризову нараду. П'ять рівнів, близько 15 хвилин.";

// Level 1: the meetings with the founders. A meeting with `range` also asks for
// the range to name; low and high are the bounds the answer may fall into.
export type Method = "analog" | "parametric" | "threePoint" | "bottomUp";

export const METHODS: { key: Method; name: string; note: string }[] = [
  { key: "analog", name: "За аналогами", note: "Взяти витрати на схожу минулу гру і скоригувати." },
  { key: "parametric", name: "Параметрично", note: "Помножити ціну одиниці на кількість." },
  { key: "threePoint", name: "За трьома точками", note: "Дати оптимістичну, найімовірнішу й песимістичну суму." },
  { key: "bottomUp", name: "Знизу вгору", note: "Оцінити кожен робочий пакет WBS і скласти суми." },
];

export const POINT = BUDGET;
export const SCALE = { min: 150, max: 600, step: 5 };

export type Range = { low: [number, number]; high: [number, number]; guide: [number, number]; ok: string };

export const MEETINGS: { stage: string; facts: string; method: Method; why: string; range?: Range }[] = [
  {
    stage: "Ідея",
    facts:
      "Є лише задум, робіт ще ніхто не розписував. Минула схожа гра коштувала 250 тис. грн, нова трохи більша, а долар подорожчав.",
    method: "analog",
    why: "Крім минулої гри, опертися поки ні на що. Це швидко, але грубо.",
    range: {
      low: [205, 250],
      high: [450, 560],
      guide: [225, 525],
      ok: "Зараз студія знає мало, тому реальна сума може бути на чверть меншою або на три чверті більшою: 225–525 тис. грн. Скажи, що вилка звузиться, коли буде WBS.",
    },
  },
  {
    stage: "Тестування",
    facts: "Тестувальник бере 250 грн за годину. На перевірку гри на телефонах зазвичай іде близько 100 годин.",
    method: "parametric",
    why: `Є ціна одиниці й кількість: 250 грн × 100 годин = ${COSTS[7]} тис. грн.`,
  },
  {
    stage: "Сервер",
    facts: "Сервер оплачують у доларах, а курс плаває. Якщо все вдало, вийде 29 тис. грн, найімовірніше 35, а якщо курс підведе, 41.",
    method: "threePoint",
    why: `Це три суми на одну роботу. Найімовірнішій дають найбільшу вагу, тож для бюджету виходить ${COSTS[4]} тис. грн.`,
  },
  {
    stage: "WBS готова",
    facts: `Команда оцінила кожен робочий пакет. Разом ${BAC} тис. грн і ще ${CONTINGENCY} тис. резерву на відомі ризики.`,
    method: "bottomUp",
    why: "Сума зібрана з окремих пакетів. Так найдовше, зате найточніше.",
    range: {
      low: [275, 295],
      high: [320, 345],
      guide: [285, 330],
      ok: "Перед стартом робіт реальна сума зазвичай на 5% менша або на 10% більша за оцінку: 285–330 тис. грн. Вилка стала в кілька разів вужчою, бо студія знає більше.",
    },
  },
];

export const judgeRange = (r: Range, low: number, high: number) => {
  const lowOk = low >= r.low[0] && low <= r.low[1];
  const highOk = high >= r.high[0] && high <= r.high[1];
  if (lowOk && highOk) return "ok";
  return low > r.low[1] || high < r.high[0] ? "narrow" : "wide";
};

// Level 2: what makes up the budget, then when the loan has to arrive.
export const BUDGET_CARDS: { name: string; sum: number; note: string; inside: boolean; why: string }[] = [
  {
    name: "Кошториси всіх робіт",
    sum: BAC,
    note: "Вартість механіки, дизайну, сервера й решти робіт разом.",
    inside: true,
    why: "Бюджет складається з кошторисів окремих робіт.",
  },
  {
    name: "Резерв на відомі ризики",
    sum: CONTINGENCY,
    note: "Гроші на ризики, які команда вже записала.",
    inside: true,
    why: "Цей резерв входить у бюджет, і керівник проєкту може ним користуватися.",
  },
  {
    name: "Управлінський резерв",
    sum: 40,
    note: "Гроші засновників на те, чого ніхто не передбачив.",
    inside: false,
    why: "Він лежить поза бюджетом. Витратити його можна лише з рішення засновників.",
  },
  {
    name: "Кредит банку",
    sum: 200,
    note: "Гроші, які надійдуть на рахунок студії.",
    inside: false,
    why: "Це джерело грошей, а не витрата. Бюджет показує, скільки студія витратить, а не звідки візьме.",
  },
];

export const LOAN = 200;
export const LOAN_WEEKS = PV_CURVE.length - 2;
// 10% a year on the loan, as in module 4: about 400 UAH for each extra week.
export const INTEREST_PER_WEEK = 0.4;

export const CASH_ROUNDS: { own: number; lead: string; after: string }[] = [
  {
    own: 120,
    lead: "Засновники вносять 120 тис. грн на старті. Решту дасть банк: кредит 200 тис. грн.",
    after: "Щойно найдорожчі тижні почалися, внеску засновників перестало вистачати. Дизайн, механіка й сервер ідуть паралельно, тож гроші тануть швидко.",
  },
  {
    own: 90,
    lead: "Новина: засновники зможуть внести лише 90 тис. грн. Кредит той самий. Коли він потрібен тепер?",
    after: "Менше власних грошей — раніше настає день, коли без кредиту нічим платити. Тому графік витрат щоразу звіряють із графіком надходжень.",
  },
];

// The balance at the end of week `w` when the loan arrives at the start of `loanWeek`.
export const balance = (own: number, loanWeek: number, w: number) => own + (w >= loanWeek ? LOAN : 0) - PV_CURVE[w];

export const gapWeeks = (own: number, loanWeek: number) =>
  PV_CURVE.map((_, w) => w).filter((w) => balance(own, loanWeek, w) < 0);

// The latest week the loan can arrive without a cash gap.
export const latestSafeWeek = (own: number) => PV_CURVE.findIndex((pv) => pv > own);

// Level 3: honest progress at week 8. `options` are the amounts to credit, in
// thousands of hryvnias; `says` is what the team would credit.
export const ALREADY_DONE = [
  { name: "Концепція", sum: COSTS[1] },
  { name: "Дизайн", sum: COSTS[2] },
  { name: "Маркетинг", sum: COSTS[6] },
];

export const PROGRESS: {
  name: string;
  cost: number;
  claim: string;
  rule: string;
  fact: string;
  says: number;
  right: number;
  options: number[];
  why: string;
}[] = [
  {
    name: "Механіка",
    cost: COSTS[3],
    claim: "Програміст: «Та вже 95%, лишилися дрібниці».",
    rule: "За віхами: прототип — 25%, бета — 75%, тести — 100%.",
    fact: "Прототип і бету показали, тести ще не проходили.",
    says: 57,
    right: 45,
    options: [15, 45, 57, 60],
    why: "Бета є, тестів немає, тож 75% від 60 тис. Останні «дрібниці» часто займають найбільше часу.",
  },
  {
    name: "Рівні",
    cost: COSTS[5],
    claim: "Дизайнерка рівнів: «Майже половина готова».",
    rule: "За віхами: 7 рівнів — третина, 14 — дві третини, 20 — усе.",
    fact: "Готово 8 рівнів із 20.",
    says: 22.5,
    right: 15,
    options: [0, 15, 22.5, 30],
    why: "Перша віха пройдена, друга ще ні: третина від 45 тис.",
  },
  {
    name: "Сервер",
    cost: COSTS[4],
    claim: "Розробник: «Десь на 80%, я б іще причесав код».",
    rule: "0/100: зараховуємо лише повністю завершену роботу.",
    fact: "Сервер і таблицю рекордів уже прийняли.",
    says: 28,
    right: 35,
    options: [0, 17.5, 28, 35],
    why: "Роботу прийнято, отже 100%. Правило захищає і від завищень, і від зайвої скромності.",
  },
  {
    name: "Тестування",
    cost: COSTS[7],
    claim: "Тестувальниця: «Я вже запускала гру, вважайте 20%».",
    rule: "50/50: половина на старті, половина після завершення.",
    fact: "За планом ця робота ще не почалася, збірка для тестів не готова.",
    says: 5,
    right: 0,
    options: [0, 5, 12.5, 25],
    why: "Робота не стартувала, тому зараховувати нічого. Правило не знає «трохи подивилася».",
  },
];

const doneSum = ALREADY_DONE.reduce((s, t) => s + t.sum, 0);
export const WORDS_EV = doneSum + PROGRESS.reduce((s, p) => s + p.says, 0);
export const HONEST_EV = doneSum + PROGRESS.reduce((s, p) => s + p.right, 0);
export const PLANNED = STATUS.pv;

// Level 4: the reports. The first one opens with the founders' question.
export type Corner = "lateOver" | "lateUnder" | "aheadOver" | "aheadUnder";

export const CORNERS: { key: Corner; name: string }[] = [
  { key: "lateUnder", name: "Відстає, але економить" },
  { key: "aheadUnder", name: "Випереджає і економить" },
  { key: "lateOver", name: "Відстає і перевитрачає" },
  { key: "aheadOver", name: "Випереджає, але перевитрачає" },
];

export const cornerOf = (r: { pv: number; ev: number; ac: number }): Corner =>
  r.ev < r.pv ? (r.ev < r.ac ? "lateOver" : "lateUnder") : r.ev < r.ac ? "aheadOver" : "aheadUnder";

export const BONUS_ASK = {
  text: "Витратили 150 тис. замість запланованих 200. Економія 50 тис.! Може, премію команді?",
  options: [
    { text: "Спершу спитати, скільки роботи зроблено", right: true },
    { text: "Так, команда заслужила премію", right: false },
    { text: "Ні, краще одразу зменшити бюджет на 50 тис.", right: false },
  ],
  why: "Два числа нічого не кажуть: можливо, студія витратила менше, бо менше зробила. Спершу потрібен освоєний обсяг.",
};

export const REPORTS: {
  week: number;
  story: string;
  pv: number;
  ev: number;
  ac: number;
  read: string;
  action?: { ask: string; options: { text: string; right?: boolean; why: string }[] };
}[] = [
  {
    week: 8,
    story: "Той самий звіт із засновниками. Команда зробила роботи на 140 тис. у планових цінах.",
    pv: 200,
    ev: 140,
    ac: 150,
    read: "Зробили на 140 замість 200 і заплатили за це 150: кожна гривня дала 93 копійки роботи. Економії немає, є відставання.",
  },
  {
    week: 5,
    story: "Сервер прийняли раніше, а дизайн іде швидше, ніж планували.",
    pv: 128,
    ev: 140,
    ac: 120,
    read: "Зроблено більше за план, а витрачено менше: кожна гривня дала 1 грн 17 коп. роботи.",
    action: {
      ask: "Що робиш?",
      options: [
        {
          text: "Перевіряю, чи роботу справді прийнято і чому вона вийшла дешевшою",
          right: true,
          why: "Хороші цифри теж треба пояснити. Може, команда знайшла кращий спосіб, а може, оцінка була завищена або пропущено перевірку.",
        },
        {
          text: "Раз є гроші, додаю в гру нові функції",
          why: "Так зміст розповзається без рішення. Залишок ще може знадобитися: попереду найдорожчі тижні.",
        },
        {
          text: "Прошу засновників одразу зменшити бюджет",
          why: "Зарано: це лише 5-й тиждень із 13, і один хороший звіт не гарантує такого ж кінця.",
        },
      ],
    },
  },
  {
    week: 10,
    story: "Щоб випередити графік, студія найняла підрядника, а команда працює у вихідні.",
    pv: 230,
    ev: 245,
    ac: 275,
    read: "Студія випереджає план, але платить дорого: кожна гривня дає лише 89 копійок роботи.",
    action: {
      ask: "Що робиш?",
      options: [
        {
          text: "Прибираю понаднормові: випередження не варте цих грошей",
          right: true,
          why: "Дату ніхто не просив наближати, а резерв тане. Краще повернутися до плану й зберегти гроші.",
        },
        {
          text: "Святкую: ми ж попереду графіка",
          why: "Випереджати за будь-яку ціну не було метою. Якщо так триватиме, бюджету не вистачить.",
        },
        {
          text: "Додаю ще людей, щоб вийти раніше",
          why: "Це ще більше витрат, а кожна гривня й так дає менше, ніж планували.",
        },
      ],
    },
  },
  {
    week: 8,
    story: "Дизайнер два тижні на лікарняному, його роботу ніхто не взяв, і зарплату за цей час майже не нарахували.",
    pv: 200,
    ev: 170,
    ac: 150,
    read: "Кожна гривня дає 1 грн 13 коп. роботи, але робота відстає на 30 тис. Малі витрати тут не заслуга, а симптом.",
    action: {
      ask: "Що робиш?",
      options: [
        {
          text: "Шукаю, хто візьме роботу: гроші на неї є, бракує людей",
          right: true,
          why: "Відставання спричинила порожня роль. Закрити її можна зі зекономлених грошей.",
        },
        {
          text: "Звітую про економію 50 тис.",
          why: "Коли робота наздожене план, ці гроші все одно доведеться витратити. А дата вже під загрозою.",
        },
        {
          text: "Прибираю частину рівнів",
          why: "Зміст різати зарано: проблема не в обсязі, а в тому, що роботу ніхто не робить.",
        },
      ],
    },
  },
];

// Level 5: the forecast at week 8, then three events that move it.
export const FORECAST = {
  min: 270,
  max: 350,
  step: 5,
  right: Math.round(BAC / (STATUS.ev / STATUS.ac) / 5) * 5,
  tolerance: 5,
  why: `Кожна гривня дає 90 копійок роботи. Щоб зробити роботи на ${BAC} тис., треба близько 300 тис. Це прогноз вартості (EAC): студія з'їсть увесь резерв.`,
};

export const DATE_FORECAST = {
  options: [13, 14, 16, 18],
  right: 14,
  why: "Студія робить 93% того, що планувала на цей час, тож 13 тижнів розтягнуться приблизно до 14.",
};

export type EventOption = { text: string; delta: number; limit?: number; right?: boolean; dirty?: boolean; why: string };

export const MEETING_EVENTS: { title: string; text: string; cause: string; options: EventOption[] }[] = [
  {
    title: "Понаднормові",
    text: "Програміст третій тиждень працює понаднормово. Поки так триває, кожна гривня і далі дає 90 копійок роботи.",
    cause: "слабкий контроль: проміжний результат вчасно не перевірили",
    options: [
      {
        text: "Шукаю причину, а не лише цифру",
        delta: -12,
        right: true,
        why: "Виявилось, прототип ніхто не перевіряв, тож механіку довелося переробляти. Запровадили перевірки раз на тиждень, понаднормові зникли.",
      },
      {
        text: "Забороняю понаднормові, решту не чіпаю",
        delta: 0,
        why: "Цифру притиснули, але причина лишилась: переробки тривають, а робота відстає ще більше.",
      },
      {
        text: "Нічого не змінюю: на це є резерв",
        delta: 8,
        why: "Резерв уже з'їдений у прогнозі. Без змін причина й далі коштує грошей.",
      },
    ],
  },
  {
    title: "Долар",
    text: "Ліцензія рушія і сервери подорожчали разом із доларом: ще 12 тис. грн. Керівник проєкту сам погоджує до 10 тис.",
    cause: "зовнішня: курс валют",
    options: [
      {
        text: "Оформлюю запит на зміну до засновників",
        delta: 12,
        limit: 12,
        right: true,
        why: "12 тис. більше за поріг, тож вирішують засновники. Вони дали гроші з управлінського резерву, і межа бюджету зросла разом із прогнозом.",
      },
      {
        text: "Беру гроші з управлінського резерву без погодження",
        delta: 12,
        dirty: true,
        why: "Цей резерв належить засновникам, і керівник проєкту не може його витратити сам. Витрата лишилась, а межа ні.",
      },
      {
        text: "Нікому не кажу: може, курс ще впаде",
        delta: 12,
        dirty: true,
        why: "Курс не впав. Перевищення виявиться пізніше, коли вибирати буде вже майже нема з чого.",
      },
    ],
  },
  {
    title: "Рівні",
    text: "Рівні виходять дорожчими, ніж оцінили: на всі 20 піде ще 15 тис. грн. До релізу зовсім небагато часу.",
    cause: "брак інформації на старті",
    options: [
      {
        text: "У реліз 15 рівнів, решта оновленням",
        delta: 0,
        right: true,
        why: "Скорочений зміст вміщається в гроші, а гравці все одно отримають усі рівні, тільки пізніше.",
      },
      {
        text: "Вирізаю тестування: це мінус 25 тис.",
        delta: -10,
        dirty: true,
        why: "Число красиве, але баги дійдуть до гравців, а виправляти їх після релізу дорожче. Така економія лише відкладає витрати.",
      },
      {
        text: "Робимо всі 20 за будь-яку ціну",
        delta: 15,
        why: "Перевищення росте, і ніхто цього не вирішував. Варто було спитати, що найцінніше встигнути за ці гроші.",
      },
    ],
  },
];

export const METER = { min: 260, max: 340 };

export const MAX_DIAMONDS =
  MEETINGS.length +
  MEETINGS.filter((m) => m.range).length +
  BUDGET_CARDS.length +
  CASH_ROUNDS.length * 2 +
  PROGRESS.length +
  1 +
  REPORTS.length +
  REPORTS.filter((r) => r.action).length +
  2 +
  MEETING_EVENTS.length +
  1;
