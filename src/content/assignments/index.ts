// Which modules already have their assignment (a short game). Modules not
// listed here show «Завдання модуля — скоро».
import { TITLE as MODULE_01 } from "./module-01";
import { TITLE as MODULE_02 } from "./module-02";
import { TITLE as MODULE_03 } from "./module-03";
import { TITLE as MODULE_04 } from "./module-04";
import { TITLE as MODULE_05 } from "./module-05";
import { TITLE as MODULE_06 } from "./module-06";
import { TITLE as MODULE_07 } from "./module-07";
import { TITLE as MODULE_08 } from "./module-08";
import { TITLE as MODULE_09 } from "./module-09";
import { TITLE as MODULE_10 } from "./module-10";
import { TITLE as MODULE_11 } from "./module-11";
import { TITLE as MODULE_12 } from "./module-12";

export const ASSIGNMENTS: Record<string, { title: string }> = {
  "module-01": { title: MODULE_01 },
  "module-02": { title: MODULE_02 },
  "module-03": { title: MODULE_03 },
  "module-04": { title: MODULE_04 },
  "module-05": { title: MODULE_05 },
  "module-06": { title: MODULE_06 },
  "module-07": { title: MODULE_07 },
  "module-08": { title: MODULE_08 },
  "module-09": { title: MODULE_09 },
  "module-10": { title: MODULE_10 },
  "module-11": { title: MODULE_11 },
  "module-12": { title: MODULE_12 },
};

export const assignmentHref = (moduleSlug: string) => `/modules/${moduleSlug}/assignment`;
