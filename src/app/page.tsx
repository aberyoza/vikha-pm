import { CourseGantt } from "@/components/course-gantt";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { publishedModules } from "@/content/course";

const steps = [
  {
    title: "Урок",
    text: "Короткий текст і схеми. Кожне поняття — на прикладі з реального проєкту.",
  },
  {
    title: "Завдання",
    text: "Застосовуєте тему до власного проєкту: робочого чи особистого.",
  },
  {
    title: "Фідбек",
    text: "Автор читає відповідь і пише, що вийшло і що посилити.",
  },
];

const audience = [
  {
    title: "Новачкам",
    text: "Хочете зрозуміти, як працюють проєкти, і зробити перші кроки в професії.",
  },
  {
    title: "Практикам",
    text: "Ведете проєкти інтуїтивно й хочете системи та перевірених інструментів.",
  },
  {
    title: "Досвідченим",
    text: "Хочете впорядкувати знання за PMBOK 7 і 8.",
  },
];

export default function Home() {
  const first = publishedModules[0];
  const startHref = first
    ? `/modules/${first.slug}/${first.lessons[0].slug}`
    : "/#program";

  return (
    <main>
      <div className="hero-glow">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <section className="grid items-end gap-10 pt-16 pb-10 sm:pt-20 lg:grid-cols-[7fr_4fr] lg:gap-12">
            <h1 className="max-w-[13ch] font-display text-[40px] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-[76px]">
              Управління проєктами від першої{" "}
              <span className="relative inline-block">
                віхи
                <svg
                  aria-hidden
                  viewBox="0 0 200 24"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[0.12em] left-[-4%] h-[0.32em] w-[108%] overflow-visible"
                >
                  <path
                    d="M4 15 C 38 7, 74 19, 112 11 S 172 7, 196 13"
                    pathLength={1}
                    className="marker-stroke fill-none stroke-accent"
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              до результату
            </h1>
            <div>
              <p className="mb-6 max-w-[36ch] text-lg text-muted">
                Безкоштовний курс українською на основі PMBOK 7 і 8.
                Чотирнадцять модулів, практичні завдання і фідбек від автора.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <ButtonLink href={startHref}>
                  Почати з модуля {first?.number ?? 1}
                </ButtonLink>
                <ButtonLink href="/#program" variant="text">
                  Програма курсу
                </ButtonLink>
              </div>
            </div>
          </section>

          <section id="program" className="scroll-mt-6 pt-6 pb-24">
            <h2 className="sr-only">Програма курсу</h2>
            <CourseGantt />
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <section className="grid gap-10 py-20 lg:grid-cols-[4fr_7fr] lg:gap-12">
          <SectionHeading>Як проходить кожен модуль</SectionHeading>
          <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-6 sm:before:absolute sm:before:top-[7px] sm:before:right-2 sm:before:left-2 sm:before:h-0.5 sm:before:bg-border">
            {steps.map((step, i) => (
              <li key={step.title} className="relative pl-8 sm:pt-8 sm:pl-0">
                <span
                  aria-hidden
                  className={`absolute top-1.5 left-0.5 size-3 rotate-45 rounded-[2px] border-2 border-accent sm:top-0.5 ${
                    i === steps.length - 1 ? "bg-accent" : "bg-background"
                  }`}
                />
                <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-10 pb-24 lg:grid-cols-[4fr_7fr] lg:gap-12">
          <SectionHeading>Кому підійде</SectionHeading>
          <dl className="grid gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-8">
            {audience.map((item) => (
              <div key={item.title} className="contents">
                <dt className="font-display text-2xl font-semibold tracking-tight">{item.title}</dt>
                <dd className="-mt-4 text-lg sm:mt-0 sm:pt-1">{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
