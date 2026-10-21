import Link from "next/link";
import { modules } from "@/content/course";
import { Figure } from "./figure";

// What part of PMBOK 8 each course module covers.
const basis: Record<number, string> = {
  1: "основи: проєкт, цінність, середовище",
  2: "6 принципів",
  3: "підходи до розробки, життєвий цикл, фокусні області, адаптація",
  4: "бізнес-кейс і домен «Фінанси»",
  5: "домен «Зацікавлені сторони»",
  6: "домен «Врядування»",
  7: "домен «Зміст»",
  8: "домен «Розклад»",
  9: "домен «Фінанси»",
  10: "домен «Ресурси»",
  11: "домен «Ризики»",
  12: "принцип «Вбудована якість»",
  13: "адаптивні підходи на практиці",
  14: "вимірювання, закриття, тренди",
};

// The course program mapped onto the structure of PMBOK 8.
export function CourseMap() {
  return (
    <Figure
      title="Карта курсу"
      lead="Курс іде за структурою PMBOK 8: основи, принципи, підходи, потім домени."
      caption="Модулі без посилання ще готуються."
    >
      <ol className="divide-y divide-grid text-sm">
        {modules.map((m) => {
          const open = m.published && m.lessons.length > 0;
          return (
            <li key={m.slug} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 py-2 @xl:grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)] @xl:gap-4">
              <span className="font-display font-semibold text-accent tabular-nums">{m.number}</span>
              {open ? (
                <Link
                  href={`/modules/${m.slug}/${m.lessons[0].slug}`}
                  className="font-medium underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
                >
                  {m.title}
                </Link>
              ) : (
                <span className="text-muted">{m.title}</span>
              )}
              <span className="col-start-2 text-[13px] text-muted @xl:col-start-3">{basis[m.number]}</span>
            </li>
          );
        })}
      </ol>
    </Figure>
  );
}
