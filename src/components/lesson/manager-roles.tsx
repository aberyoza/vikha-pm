import { Figure } from "./figure";

const rows = [
  { label: "Керує", fm: "Постійним відділом", pm: "Конкретним проєктом" },
  { label: "Відповідає за", fm: "Людей і якість фахової роботи", pm: "Результат, строки, бюджет, ризики" },
  { label: "Скільки триває роль", fm: "Безстроково", pm: "До завершення проєкту" },
  { label: "Головне питання", fm: "Хто і як якісно це робить?", pm: "Що, коли й за скільки?" },
  { label: "Приклад", fm: "Керівник відділу бекенд-розробки", pm: "Менеджер запуску мобільного застосунку" },
];

export function ManagerRoles() {
  return (
    <Figure
      title="FM і PM"
      lead="Один керує відділом, інший — проєктом."
      caption="Фахівець може одночасно звітувати обом: FM — як співробітник відділу, PM — як учасник проєкту."
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-3 text-sm @md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)]">
        <span className="hidden @md:block" />
        <p className="pb-3 font-display text-lg font-semibold">
          Функціональний <span className="text-muted">(FM)</span>
        </p>
        <p className="pb-3 font-display text-lg font-semibold text-accent">
          Проєктний <span className="text-accent/70">(PM)</span>
        </p>

        {rows.map((r) => (
          <div key={r.label} className="contents">
            <p className="col-span-2 border-t border-grid pt-2.5 text-[13px] text-muted @md:col-span-1 @md:pb-2.5">
              {r.label}
            </p>
            <p className="pb-2.5 @md:border-t @md:border-grid @md:pt-2.5">{r.fm}</p>
            <p className="pb-2.5 @md:border-t @md:border-grid @md:pt-2.5">{r.pm}</p>
          </div>
        ))}
      </div>
    </Figure>
  );
}
