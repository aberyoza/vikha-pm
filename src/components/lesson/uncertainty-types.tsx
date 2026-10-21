import { Figure } from "./figure";

const types = [
  {
    name: "Неоднозначність",
    what: "незрозуміло, що відбувається і чого чекати",
    game: "чи сподобається гравцям наша механіка?",
    how: "прототипи, експерименти, ранній відгук",
  },
  {
    name: "Складність",
    what: "багато частин, які впливають одна на одну",
    game: "зміна механіки тягне зміни в рівнях, сервері й тестах",
    how: "розбивати на частини, бачити систему цілком",
  },
  {
    name: "Волатильність",
    what: "швидкі й непередбачувані зміни",
    game: "курс долара, ціни на рекламу, правила магазинів",
    how: "резерви, запасні варіанти, короткі ітерації",
  },
  {
    name: "Ризик",
    what: "конкретна подія, яка може статися чи ні",
    game: "ключовий програміст може піти",
    how: "управління ризиками: решта модуля",
  },
];

// The four faces of uncertainty, with an example and a way to cope.
export function UncertaintyTypes() {
  return (
    <Figure
      title="Чотири обличчя невизначеності"
      lead="Невизначеність ширша за ризики — і з кожним її видом працюють по-своєму."
    >
      <ul className="grid gap-3 @xl:grid-cols-2">
        {types.map((t, i) => (
          <li
            key={t.name}
            className={`rounded-[4px] border p-4 ${i === types.length - 1 ? "border-accent bg-accent-soft/60" : "border-border"}`}
          >
            <p className="font-display text-lg font-semibold">{t.name}</p>
            <p className="text-[13px] text-muted">{t.what}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">У грі: </span>
              {t.game}
            </p>
            <p className="mt-1 text-sm">
              <span className="font-medium">Що допомагає: </span>
              {t.how}
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
