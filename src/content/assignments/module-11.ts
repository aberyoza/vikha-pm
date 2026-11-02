// Module 11 game «Що може піти не так?»: the risks of the cat game. Clear the fog,
// describe risks precisely, rank them on a heat map, find where the game is thin,
// buy protection for the reserve and keep the register alive. The risks, their
// losses, measures and triggers come from game-risks.ts, so they match the lessons.
import { riskLevel } from "@/content/my-project";
import { BASE_NPV, CRITICAL, RESERVE, RISKS, STATUS_LABEL, npvWith, simulate, type Factor } from "@/content/examples/game-risks";

export const TITLE = "Що може піти не так?";

export const INTRO =
  "Реліз гри про котів близько, а засновники кажуть: «Усе буде добре». Збери реєстр ризиків, знайди, де тонко, вибери захист за резерв і проведи реєстр до релізу. П'ять рівнів, близько 20 хвилин.";

export const round = (v: number) => Math.round(v);
export const signed = (v: number) => (v >= 0 ? `+${round(v)}` : `−${round(-v)}`);

// Level 1, step 1: what to do with each kind of uncertainty.
export type Tool = "prototype" | "split" | "buffer" | "register";

export const TOOLS: { key: Tool; name: string; note: string }[] = [
  { key: "prototype", name: "Зробити прототип", note: "перевірити на людях, а не гадати" },
  { key: "split", name: "Розбити на частини", note: "розплутати, що від чого залежить" },
  { key: "buffer", name: "Резерв і короткі ітерації", note: "бути готовими до стрибків" },
  { key: "register", name: "Рядок у реєстрі ризиків", note: "оцінити конкретну подію і підготувати реакцію" },
];

export const FOGS: { text: string; tool: Tool; kind: string; why: string }[] = [
  {
    text: "Чи сподобається гравцям механіка з котами? Дизайнер каже «так», програміст каже «ні».",
    tool: "prototype",
    kind: "Неоднозначність",
    why: "Незрозуміло, чого чекати, і суперечка цього не вирішить. Прототип на кількох гравцях дасть відповідь за кілька днів.",
  },
  {
    text: "Зміниш механіку, і вона зачепить рівні, сервер і тести. Ніхто не бачить усієї картини.",
    tool: "split",
    kind: "Складність",
    why: "Багато частин впливають одна на одну. Спершу їх розбирають на частини і дивляться на зв'язки між ними.",
  },
  {
    text: "Ціни на рекламу цього місяця стрибнули двічі, і ніхто не знає, що буде далі.",
    tool: "buffer",
    kind: "Волатильність",
    why: "Швидкі зміни не передбачити. Захищають гроші про запас і короткі кроки, після яких можна змінити план.",
  },
  {
    text: "Лише один програміст знає код механіки. Якщо він піде, пошук заміни займе два місяці.",
    tool: "register",
    kind: "Ризик",
    why: "Це конкретна подія: вона може статися чи ні, і її можна оцінити. Таким подіям дають рядок у реєстрі.",
  },
];

// Level 1, step 2: turn a vague word into cause, event and consequence.
export type Part = "cause" | "event" | "effect";

export const PARTS: { key: Part; name: string; lead: string }[] = [
  { key: "cause", name: "Причина", lead: "Через те що…" },
  { key: "event", name: "Подія", lead: "…може статися таке:" },
  { key: "effect", name: "Наслідок", lead: "…і тоді:" },
];

// In each part the first option is the right one; the game shuffles them.
export const STICKERS: { word: string; parts: Record<Part, string[]>; why: string }[] = [
  {
    word: "Комерційний ризик",
    parts: {
      cause: ["ми не перевірили, скільки гравці готові платити", "ціну покупок у грі буде завищено", "ринок ігор дуже складний"],
      event: ["ціну покупок у грі буде завищено", "ми не перевірили, скільки гравці готові платити", "доходи першого року впадуть на 20%"],
      effect: ["доходи першого року впадуть на 20%", "буде погано", "ми не перевірили ціну"],
    },
    why: "Такий опис одразу підказує, що робити: перевірити ціну заздалегідь.",
  },
  {
    word: "Кадрові проблеми",
    parts: {
      cause: ["лише одна людина знає код ігрової механіки", "ключовий програміст піде зі студії", "із людьми завжди важко"],
      event: ["ключовий програміст піде зі студії", "із людьми завжди важко", "нову людину доведеться шукати два місяці"],
      effect: ["два місяці на пошук і навчання, збиток 40 тис. грн", "будуть проблеми", "лише одна людина знає код"],
    },
    why: "Тепер видно, що лікувати: не «кадри», а те, що код знає лише одна людина.",
  },
  {
    word: "Технічний ризик",
    parts: {
      cause: ["не перевірили, чи витримає сервер наплив гравців", "сервер упаде в день релізу", "технології складні"],
      event: ["сервер упаде в день релізу", "щось зламається", "гравці видалять гру"],
      effect: ["гравці не зможуть увійти й видалять гру, збиток 18 тис. грн", "буде неприємно", "не перевірили сервер"],
    },
    why: "З таким описом зрозуміло, який захід потрібен: тест навантаження до релізу.",
  },
];

// Level 2: the heat map. The risks are the lessons' ones.
export const SCALE = [1, 2, 3, 4, 5];
export const RISK_ID = (key: string) => `R-${RISKS.findIndex((r) => r.key === key) + 1}`;
export const TOP_TWO = ["price", "server"];

export const zoneClass = (p: number, i: number) => {
  const v = p * i;
  return v >= 12 ? "bg-risk-3" : v >= 6 ? "bg-risk-2" : "bg-risk-1";
};

export const PICK_WHY =
  "Найбільший збиток не означає найвищий пріоритет. Програміст коштує найдорожче, але дає 2 × 5 = 10. Ціна і сервер імовірніші: по 3 × 4 = 12. Тому перші дві реакції для них.";

export const OFFER = {
  key: "developer",
  p: 4,
  text: "Новина: програміст отримав пропозицію від іншої компанії і думає над нею. Імовірність того, що він піде, зросла з 2 до 4. Вплив той самий, 5.",
  why: "4 × 5 = 20: тепер цей ризик перший. Оцінки не вічні, тому реєстр регулярно переглядають і переставляють.",
};

// Level 3: find the limit of each factor, then see the tornado and a thousand futures.
export const SLIDERS: {
  key: Factor;
  label: string;
  hint: string;
  min: number;
  max: number;
  change: (v: number) => number;
  show: (v: number) => string;
  limit: string;
}[] = [
  {
    key: "revenue",
    label: "Доходи гри",
    hint: "наскільки менше заробить гра",
    min: 0,
    max: 30,
    change: (v) => -v / 100,
    show: (v) => (v === 0 ? "як у плані" : `−${v}%`),
    limit: `падіння на ${round(CRITICAL.revenueDrop * 100)}%`,
  },
  {
    key: "cost",
    label: "Вартість розробки",
    hint: "наскільки дорожчою стане розробка",
    min: 0,
    max: 40,
    change: (v) => v / 100,
    show: (v) => (v === 0 ? "як у плані" : `+${v}%`),
    limit: `зростання на ${round(CRITICAL.costRise * 100)}%`,
  },
  {
    key: "rate",
    label: "Ставка",
    hint: "скільки вимагає інвестор, у плані 10% на рік",
    min: 10,
    max: 25,
    change: (v) => (v - 10) / 10,
    show: (v) => `${v}%`,
    limit: `зростання з 10% до ${round(CRITICAL.rate * 100)}%, тобто на ${round(((CRITICAL.rate - 0.1) / 0.1) * 100)}%`,
  },
];

export const THIN_FACTOR: Factor = "revenue";

// The tornado: NPV when each factor moves by ten percent either way.
export const TORNADO = SLIDERS.map((s) => {
  const a = npvWith(s.key, 0.1);
  const b = npvWith(s.key, -0.1);
  return { key: s.key, label: s.label, low: Math.min(a, b), high: Math.max(a, b) };
}).sort((x, y) => y.high - y.low - (x.high - x.low));

export const LINK_ASK = {
  text: `Засновник дивиться на діаграму: «Доходи найчутливіші. Піднімемо ціни на 10%, доходи зростуть на 10%, і NPV стане ${round(npvWith("revenue", 0.1))} тис.». Де тут помилка?`,
  options: [
    {
      text: "Вища ціна зазвичай зменшує продажі, а цей метод змінює лише один фактор",
      right: true,
      why: "Аналіз чутливості не бачить зв'язків між факторами. Щоб змінити кілька разом, потрібні сценарії.",
    },
    { text: "Помилка в числах: від +10% доходів NPV не зросте", why: "Числа правильні, якщо змінити самі доходи. Помилка в припущенні, що ціна змінює лише доходи, а продажі лишаються." },
    { text: "Помилки немає, підіймаємо ціни", why: "Метод змінює один фактор, а ціна тягне за собою й продажі. Такий висновок він дати не може." },
  ],
};

// A fixed sample, the first one the lesson's figure shows.
export const RUNS = 1000;
export const MC_SAMPLE = simulate(RUNS, 1);
export const MC_MEAN = MC_SAMPLE.reduce((a, b) => a + b, 0) / RUNS;
export const MC_LOSS = MC_SAMPLE.filter((v) => v < 0).length / RUNS;
export const MC_BIN = 25;
export const MC_MIN = -200;
export const MC_MAX = 225;
export const MC_BINS = Array.from({ length: (MC_MAX - MC_MIN) / MC_BIN }, (_, k) => MC_MIN + k * MC_BIN);

export const mcCounts = (runs: number) => {
  const sample = MC_SAMPLE.slice(0, runs);
  return MC_BINS.map((b, k) =>
    sample.filter((v) => (k === 0 ? v < b + MC_BIN : k === MC_BINS.length - 1 ? v >= b : v >= b && v < b + MC_BIN)).length,
  );
};

export const MC_BETS: { key: "higher" | "same" | "lower"; name: string }[] = [
  { key: "higher", name: "Вище за план" },
  { key: "same", name: "Приблизно як у плані" },
  { key: "lower", name: "Нижче за план" },
];

export const MC_BET_WHY = `У плані NPV (чиста приведена вартість) +${round(BASE_NPV)} тис. грн, а в середньому за тисячу варіантів виходить ${signed(MC_MEAN)}. Ризики несиметричні: витрати частіше зростають, ніж падають, а доходи частіше падають, ніж зростають.`;

export const SAY_ASK = {
  text: "Засновники питають: то скільки заробить гра?",
  options: [
    {
      text: `«У середньому близько ${signed(MC_MEAN)} тис. грн, і приблизно ${round(MC_LOSS * 10)} варіанти з 10 у мінусі. Тому потрібен захист»`,
      right: true,
      why: "Так засновники бачать і середнє, і шанс збитку. На цьому можна ухвалювати рішення про резерв і реакції.",
    },
    {
      text: `«+${round(BASE_NPV)} тис. грн, так у плані»`,
      why: "План — лише один варіант майбутнього, і не середній. Така обіцянка приховує великий шанс збитку.",
    },
    {
      text: "«Гра збиткова, треба закривати проєкт»",
      why: "Більшість варіантів усе ж у плюсі, і середнє теж. Цифри кажуть не закривати, а захищатися.",
    },
  ],
};

// Level 4, step 1: decision trees. Expected value of a branch: the price of the
// measure plus the chance times the sum, in thousands of hryvnias.
export type Branch = { name: string; cost: number; chance: number; right?: boolean };

export const TREES: { name: string; text: string; sum: number; happens: string; misses: string; branches: Branch[]; why: string }[] = [
  {
    name: "Сервер у день релізу",
    text: "Якщо сервер упаде, це коштуватиме 18 тис. грн. Зараз шанс 60%.",
    sum: -18,
    happens: "Упаде",
    misses: "Не впаде",
    branches: [
      { name: "Нічого не робимо", cost: 0, chance: 60 },
      { name: "Тест навантаження", cost: 6, chance: 10, right: true },
      { name: "Оренда серверів із запасом на рік", cost: 50, chance: 0 },
    ],
    why: "Тест коштує 6 тис., зате майже прибирає загрозу. Оренда теж її прибирає, але 50 тис. захисту проти 18 тис. збитку невиправдані: захист не має бути дорожчим за збиток.",
  },
  {
    name: "Курс долара",
    text: "Сервери й ліцензії оплачуємо в доларах. Якщо курс зросте, витрати збільшаться на 12 тис. грн. Шанс 80%.",
    sum: -12,
    happens: "Зросте",
    misses: "Не зросте",
    branches: [
      { name: "Приймаємо ризик і тримаємо гроші в резерві", cost: 0, chance: 80, right: true },
      { name: "Фіксуємо курс через банк", cost: 15, chance: 0 },
    ],
    why: "Фіксація коштує 15 тис., а найгірший збиток лише 12 тис. Іноді найкраща реакція: свідомо прийняти ризик.",
  },
  {
    name: "Добірка «Нове»",
    text: "Це нагода, а не загроза: якщо магазин візьме гру в добірку, студія заробить на 60 тис. грн більше. Зараз шанс 20%.",
    sum: 60,
    happens: "Візьмуть",
    misses: "Не візьмуть",
    branches: [
      { name: "Нічого не робимо", cost: 0, chance: 20 },
      { name: "Якісний трейлер", cost: 7, chance: 50, right: true },
      { name: "Велика реклама перед релізом", cost: 40, chance: 60 },
    ],
    why: "Нагодами теж керують. Трейлер за 7 тис. підвищує шанс більш ніж удвічі, а дорога реклама додає мало і з'їдає всю вигоду.",
  },
];

export const branchValue = (b: Branch, sum: number) => -b.cost + (b.chance / 100) * sum;

// Level 4, step 2: a response for each of the six risks, within the reserve.
export const EXTRA_RESERVE = 23;
export const EXTRA_NPV = npvWith("cost", EXTRA_RESERVE / 300);

export type Option = {
  name: string;
  reaction: string;
  cost: number;
  // Paid now, or only kept in the reserve in case the risk happens.
  held?: boolean;
  // How much it costs if the risk happens in «Минув рік».
  loss: number;
  ok: boolean;
  why: string;
  note?: string;
};

export const SHOP: { key: string; options: Option[] }[] = [
  {
    key: "price",
    options: [
      { name: "A/B-тест двох цін", reaction: "Зменшити", cost: 5, loss: 0, ok: true, why: "Високий пріоритет, а захист набагато дешевший за збиток." },
      { name: "Нічого заздалегідь", reaction: "Прийняти", cost: 0, loss: 24, ok: false, why: "Для ризиків із високим пріоритетом реакцію планують заздалегідь, особливо коли вона коштує лише 5 тис." },
    ],
  },
  {
    key: "review",
    options: [
      { name: "Перевірка за правилами магазину", reaction: "Зменшити", cost: 2, loss: 0, ok: true, why: "2 тис. проти 15 тис. збитку: дешева страховка." },
      { name: "Нічого заздалегідь", reaction: "Прийняти", cost: 0, loss: 15, ok: true, why: "Пріоритет середній, тож це чесний варіант, якщо бракує грошей на важливіше." },
    ],
  },
  {
    key: "developer",
    options: [
      { name: "Документація коду і перегляд другим розробником", reaction: "Зменшити", cost: 8, loss: 5, ok: true, why: "Ризик не зникає, але збиток падає з 40 до 5 тис., бо новій людині є від чого відштовхнутися." },
      { name: "Другий програміст на весь рік", reaction: "Зменшити", cost: 60, loss: 0, ok: false, why: "60 тис. захисту проти 40 тис. збитку: дорожче за саму загрозу." },
      { name: "Нічого заздалегідь", reaction: "Прийняти", cost: 0, loss: 40, ok: false, why: "Після новини про пропозицію це перший ризик у реєстрі. Його не можна лишати без реакції." },
    ],
  },
  {
    key: "server",
    options: [
      { name: "Тест навантаження", reaction: "Зменшити", cost: 6, loss: 0, ok: true, why: "Той самий висновок, що й у дереві рішень: дешево і майже прибирає загрозу." },
      { name: "Оренда серверів із запасом на рік", reaction: "Уникнути", cost: 50, loss: 0, ok: false, why: "50 тис. захисту проти 18 тис. збитку." },
      { name: "Нічого заздалегідь", reaction: "Прийняти", cost: 0, loss: 18, ok: false, why: "Високий пріоритет, і є реакція за 6 тис. Лишати без неї невиправдано." },
    ],
  },
  {
    key: "usd",
    options: [
      { name: "Тримати суму в резерві", reaction: "Прийняти", cost: 12, held: true, loss: 12, ok: true, why: "Запобігти зростанню курсу неможливо, тому це варіант з уроку. Але він забирає багато резерву." },
      {
        name: "Оплатити сервери на рік наперед",
        reaction: "Зменшити",
        cost: 3,
        loss: 0,
        ok: true,
        why: "Дешево, але створює вторинний ризик: на рік прив'язує до одного хостингу. Це нормально, якщо вторинний ризик теж записати в реєстр.",
        note: "вторинний ризик: рік з одним хостингом",
      },
    ],
  },
  {
    key: "tax",
    options: [
      { name: "Тримати суму в резерві", reaction: "Прийняти", cost: 20, held: true, loss: 0, ok: true, why: "Чесно, але дорого: на цей один ризик іде майже весь резерв." },
      { name: "Передати рішення засновникам", reaction: "Ескалювати", cost: 0, loss: 0, ok: true, why: "Податки вирішує держава, а не проєкт. Власник цього ризику й так один із засновників, тож рішення ухвалюють вони." },
    ],
  },
];

export const YEAR_FIRES = ["developer", "server", "usd"];

export const YEAR_EVENTS: Record<string, string> = {
  developer: "Програміст прийняв пропозицію і пішов.",
  server: "У день релізу прийшло вдвічі більше гравців, ніж чекали.",
  usd: "Курс долара зріс.",
};

// Level 5, step 1: the dead register. Four cells break the signs of a living one.
export type DeadCell = { id: string; text: string; flaw?: string };

export const DEAD_REVIEW: DeadCell = {
  id: "review",
  text: "Останній перегляд: 12 тижнів тому",
  flaw: "Реєстр переглядають щотижня або щоспринта. За 12 тижнів він устиг застаріти.",
};

export const DEAD_HEADS = ["Ризик", "Пріоритет", "Власник", "Тригер", "Реакція"];

export const DEAD_ROWS: DeadCell[][] = [
  [
    { id: "s-name", text: "Сервер падає в день релізу" },
    { id: "s-prio", text: "12" },
    { id: "s-owner", text: "Команда", flaw: "Власник — одна конкретна людина. За те, що належить «команді», не стежить ніхто." },
    { id: "s-trigger", text: "Навантаження понад 70%" },
    { id: "s-resp", text: "Зменшити" },
  ],
  [
    { id: "p-name", text: "Завищено ціну покупок" },
    { id: "p-prio", text: "12" },
    { id: "p-owner", text: "Product Owner" },
    { id: "p-trigger", text: "Стане погано", flaw: "Тригер треба вміти помітити, а не лише відчути. Наприклад: покупки робить менше 2% гравців." },
    { id: "p-resp", text: "Зменшити" },
  ],
  [
    { id: "d-name", text: "Іде ключовий програміст" },
    { id: "d-prio", text: "20" },
    { id: "d-owner", text: "Технічний лідер" },
    { id: "d-trigger", text: "Повідомив про звільнення" },
    { id: "d-resp", text: "Не обрано", flaw: "Для кожного ризику з високим пріоритетом реакцію обирають заздалегідь." },
  ],
];

export const DEAD_FLAWS = [DEAD_REVIEW, ...DEAD_ROWS.flat()].filter((c) => c.flaw);

// Level 5, step 2: six Mondays with the living register.
export type Row = { id: string; key: string; name: string; trigger: string; prio: string; owner: string; status: string };

const riskRow = (r: (typeof RISKS)[number]): Row => {
  const p = r.key === OFFER.key ? OFFER.p : r.probability;
  const v = p * r.impact;
  return {
    id: RISK_ID(r.key),
    key: r.key,
    name: r.name,
    trigger: r.trigger,
    prio: `${v} — ${riskLevel(v)}`,
    owner: r.owner,
    status: STATUS_LABEL[r.status],
  };
};

export const START_ROWS: Row[] = RISKS.map(riskRow).sort((a, b) => parseInt(b.prio) - parseInt(a.prio));

export const MONDAYS: {
  text: string;
  options: { text: string; right?: boolean; why: string }[];
  effect: { key: string; status?: string; add?: Row };
}[] = [
  {
    text: "Підрядник, який тестує гру, пише: «У нас звільнилися двоє людей, але ми встигнемо». Це наслідок рішення купити тестування.",
    options: [
      {
        text: "Додаю новий рядок: причина, власник і тригер, наприклад «тест-звіт запізнився на 3 дні»",
        right: true,
        why: "Це вторинний ризик: купівля послуги створила нову залежність. Він живе в реєстрі, як і будь-який інший.",
      },
      { text: "Нічого не пишу: підрядник сказав, що встигне", why: "Обіцянка не прибирає ризик. Якщо не записати його, ніхто не стежитиме за ознаками затримки." },
      { text: "Одразу розриваю договір", why: "Ризик ще не стався, а заміна підрядника коштує дорого і створить нові ризики." },
    ],
    effect: {
      key: "vendor",
      add: { id: "R-7", key: "vendor", name: "Підрядник затримує тестування", trigger: "тест-звіт запізнився на 3 дні", prio: "9 — середній", owner: "Проєктний менеджер", status: "Відкритий" },
    },
  },
  {
    text: "Курс долара зріс на 3% від плану. Бухгалтерія хвилюється.",
    options: [
      { text: "Нічого не запускаю: поріг 5% ще не досягнуто, стежимо далі", right: true, why: "Для того й записано тригер. Він дає спокійно працювати, поки ознаки немає." },
      { text: "Терміново шукаю, як зафіксувати курс", why: "Тригер не спрацював, а фіксація коштує більше за можливий збиток. Це паніка, а не реакція." },
      { text: "Закриваю ризик: курс зріс лише трохи", why: "Ризик нікуди не зник. До порога 5% лишилося дуже мало." },
    ],
    effect: { key: "usd", status: "Під контролем" },
  },
  {
    text: "Магазин повернув гру із зауваженнями: опис не відповідає правилам.",
    options: [
      { text: "Ризик став проблемою: переношу в список проблем, а рядок лишаю з поміткою", right: true, why: "Ризик стався, тому тепер це проблема, яку вирішують. Рядок лишається як досвід для наступних проєктів." },
      { text: "Видаляю рядок: ризику більше немає", why: "Закриті ризики не видаляють. Це досвід для наступних проєктів." },
      { text: "Піднімаю імовірність до 5", why: "Імовірність уже не потрібна: подія сталася. Її треба вирішувати як проблему." },
    ],
    effect: { key: "review", status: "Став проблемою" },
  },
  {
    text: "Магазин оголосив: у добірку «Нове» візьмуть ігри, що вийдуть до 1 грудня. За планом студія встигає, але без запасу.",
    options: [
      { text: "Використати: фіксую реліз до цієї дати і призначаю власника", right: true, why: "Це нагода, і тут можна зробити так, щоб вона точно настала. Вона теж отримує рядок у реєстрі." },
      { text: "Прийняти: вийде — добре, не вийде — ну й гаразд", why: "Прийняти можна, якщо вплинути нічого. Тут дата в руках команди." },
      { text: "Ескалювати засновникам", why: "Дата релізу в межах повноважень керівника проєкту. Ескалюють те, що виходить за ці межі." },
    ],
    effect: {
      key: "selection",
      add: { id: "R-8", key: "selection", name: "Нагода: гра в добірці «Нове»", trigger: "реліз під загрозою перенесення за 1 грудня", prio: "12 — високий", owner: "Проєктний менеджер", status: "Під контролем" },
    },
  },
  {
    text: "Магазин раптово змінює правила оплати для всіх ігор. Цього не передбачав ніхто, і студія втратить 25 тис. грн.",
    options: [
      { text: "Ескалюю засновникам: це їхнє рішення і їхній управлінський резерв", right: true, why: "Управлінський резерв тримає спонсор саме на те, чого ніхто не передбачив. А загроза виходить за межі проєкту." },
      { text: "Мовчки беру з резерву на відомі ризики", why: "Той резерв призначено для ризиків із реєстру. Він потім не покриє те, на що його відкладено." },
      { text: "Приймаю: нічого не зміниш", why: "Сума і наслідки виходять за межі повноважень керівника проєкту. Рішення за спонсором." },
    ],
    effect: {
      key: "rules",
      add: { id: "R-9", key: "rules", name: "Магазин змінює правила оплати", trigger: "уже сталося", prio: "поза шкалою", owner: "Засновник студії", status: "Ескальовано" },
    },
  },
  {
    text: "Минув перший тиждень після релізу. Покупки робить 1,6% гравців, а поріг у реєстрі 2%.",
    options: [
      { text: "Прошу власника ризику запустити реакцію: перевірити дві ціни", right: true, why: "Тригер спрацював, і саме для цього в ризику є власник і готовий план дій." },
      { text: "Чекаю ще місяць: може, виправиться", why: "Тригер для того й потрібен, щоб не чекати. За місяць збиток уже буде реальним." },
      { text: "Сьогодні ж знижую ціну вдвічі, без перевірки", why: "Це дія наосліп. За планом власник ризику перевіряє дві ціни на частині гравців." },
    ],
    effect: { key: "price", status: "Реакцію запущено" },
  },
];

export const applyMondays = (count: number) => {
  let rows = START_ROWS;
  MONDAYS.slice(0, count).forEach(({ effect }) => {
    rows = effect.add ? [...rows, effect.add] : rows.map((r) => (r.key === effect.key && effect.status ? { ...r, status: effect.status } : r));
  });
  return rows;
};

export { RESERVE, RISKS, BASE_NPV };

export const MAX_DIAMONDS =
  FOGS.length + STICKERS.length + TOP_TWO.length + 1 + 4 + TREES.length + SHOP.length + DEAD_FLAWS.length + MONDAYS.length;
