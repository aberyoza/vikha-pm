// Which modules already have their assignment (a short game). Modules not
// listed here show «Завдання модуля — скоро».
import { TITLE as MODULE_01 } from "./module-01";
import { TITLE as MODULE_02 } from "./module-02";

export const ASSIGNMENTS: Record<string, { title: string }> = {
  "module-01": { title: MODULE_01 },
  "module-02": { title: MODULE_02 },
};

export const assignmentHref = (moduleSlug: string) => `/modules/${moduleSlug}/assignment`;
