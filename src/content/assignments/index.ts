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
import { TITLE as MODULE_13 } from "./module-13";
import { TITLE as MODULE_14 } from "./module-14";

// `minutes` is an estimate from the amount of text and decisions, not a measured time.
export const ASSIGNMENTS: Record<string, { title: string; minutes: number }> = {
  "module-01": { title: MODULE_01, minutes: 10 },
  "module-02": { title: MODULE_02, minutes: 10 },
  "module-03": { title: MODULE_03, minutes: 10 },
  "module-04": { title: MODULE_04, minutes: 10 },
  "module-05": { title: MODULE_05, minutes: 10 },
  "module-06": { title: MODULE_06, minutes: 10 },
  "module-07": { title: MODULE_07, minutes: 10 },
  "module-08": { title: MODULE_08, minutes: 10 },
  "module-09": { title: MODULE_09, minutes: 15 },
  "module-10": { title: MODULE_10, minutes: 15 },
  "module-11": { title: MODULE_11, minutes: 25 },
  "module-12": { title: MODULE_12, minutes: 25 },
  "module-13": { title: MODULE_13, minutes: 25 },
  "module-14": { title: MODULE_14, minutes: 25 },
};

export const assignmentHref = (moduleSlug: string) => `/modules/${moduleSlug}/assignment`;
