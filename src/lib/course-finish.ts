import { assignmentHref } from "@/content/assignments";

// The summary sits under the game of module 14; the pager and the cabinet link to it.
export const SUMMARY_ID = "course-summary";
export const summaryHref = `${assignmentHref("module-14")}#${SUMMARY_ID}`;

// Where the pager of module 14 leads while there is no summary to show.
export const PROGRAM_TARGET = { href: "/#program", label: "Далі", title: "Програма курсу" };

// «18 листопада 2026 р.»
export const formatDay = (iso: string) => new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" }).format(new Date(iso));
