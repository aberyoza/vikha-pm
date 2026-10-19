import { Figure } from "./figure";

const indicators = [
  "Термін служби найдорожчого обладнання",
  "Термін життя продукту на ринку",
  "Скільки інвестор планує бути в бізнесі",
  "Період, поки дані достовірні",
  "Термін повернення кредиту",
];

export function PlanningHorizon() {
  return (
    <Figure
      title="Горизонт планування"
      lead="Проєкт може жити роками й десятиліттями, а рахують його на коротший, умовний строк."
      caption="Схематично. Горизонт встановлюють за індикаторами, а не за повним строком життя проєкту."
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Строк життя проєкту</p>
          <div className="mt-1.5 flex h-6 items-center rounded-[3px] border-[1.5px] border-dashed border-muted/50 px-2 text-[13px] text-muted">
            роки й десятиліття
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Горизонт планування</p>
          <div className="mt-1.5 h-6 w-[45%] rounded-[3px] bg-accent" />
          <p className="mt-1 text-[13px] text-muted">в IT — зазвичай 3–5 років</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">Його визначають за індикаторами:</p>
      <ul className="mt-2 space-y-2 text-sm">
        {indicators.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-1.5 size-2 shrink-0 rotate-45 rounded-[1px] bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </Figure>
  );
}
