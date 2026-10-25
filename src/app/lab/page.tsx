"use client";

import { useState } from "react";
import { SplitFlapRow } from "@/components/split-flap";
import { modules } from "@/content/course";

const WIDTH = 18;

// Design lab: ideas under evaluation, not linked from the site.
export default function Lab() {
  const [i, setI] = useState(11);
  const m = modules[i];

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Лабораторія дизайну</h1>
      <p className="mt-3 max-w-[60ch] text-lg text-muted">
        Ідеї на оцінку. Сторінка не входить у навігацію і не індексується.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Табло наступної віхи</h2>
        <p className="mt-2 max-w-[60ch] text-muted">
          Розклад курсу як табло відправлень: літери перегортаються і зупиняються на назві модуля. Могло б стояти
          над Гантом на головній або в кінці уроку замість картки «Наступний урок».
        </p>
        <div className="mt-6 flex w-full max-w-[44rem] flex-col gap-1 rounded-[4px] bg-surface p-2 sm:p-4">
          <SplitFlapRow text="Наступна віха" width={WIDTH} />
          <SplitFlapRow text={`Модуль ${m.number}`} width={WIDTH} />
          <SplitFlapRow text={m.title.split(/[:,]/)[0]} width={WIDTH} />
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setI((i + 1) % modules.length)}
            className="press rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground"
          >
            Наступний модуль
          </button>
        </div>
      </section>
    </main>
  );
}
