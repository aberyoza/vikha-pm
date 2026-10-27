import type { Metadata } from "next";
import { ProjectPassport } from "@/components/my-project/project-passport";
import { assignmentHref } from "@/content/assignments";
import { modules } from "@/content/course";

export const instant = false;

// Personal page: its content lives in the reader's browser, so it stays out
// of search.
export const metadata: Metadata = {
  title: "Мій проєкт",
  description: "Паспорт власного проєкту, який складається віха за віхою протягом курсу.",
  alternates: { canonical: "/my-project" },
  robots: { index: false, follow: true },
};

export default function MyProjectPage() {
  const titles = Object.fromEntries(modules.map((m) => [m.number, m.title]));
  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Паспорт мого проєкту</h1>
      <ProjectPassport titles={titles} startHref={assignmentHref("module-01")} />
    </main>
  );
}
