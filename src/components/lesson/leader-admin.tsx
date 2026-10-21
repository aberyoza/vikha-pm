import { Figure } from "./figure";

const rows = [
  { situation: "Механіку переписують утретє", admin: "фіксує відставання у звіті", leader: "з'ясовує з командою, чому так, і разом шукає рішення" },
  { situation: "Дизайнер не встигає", admin: "нагадує про дедлайн", leader: "питає, що заважає, і прибирає перешкоду" },
  { situation: "Тестувальник знайшов серйозну проблему перед релізом", admin: "питає, хто винен", leader: "дякує, що сказав, і разом вирішують, чи переносити реліз" },
];

// Same situations, two styles: control versus servant leadership.
export function LeaderAdmin() {
  return (
    <Figure
      title="Адміністратор і лідер"
      lead="Обидві ролі потрібні, але в невизначеності вирішує лідерство."
      caption="Слугуючий лідер не командує кожним кроком: він створює умови, в яких команда сама добре працює."
    >
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.situation} className="rounded-[4px] border border-border p-4 text-sm">
            <p className="font-medium">{r.situation}</p>
            <div className="mt-2 grid gap-2 @xl:grid-cols-2">
              <p className="rounded-[3px] bg-background p-2.5">
                <span className="block text-[12px] text-muted">Лише адміністратор</span>
                {r.admin}
              </p>
              <p className="rounded-[3px] bg-accent-soft p-2.5">
                <span className="block text-[12px] text-muted">Лідер</span>
                {r.leader}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
