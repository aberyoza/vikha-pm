import type { MDXComponents } from "mdx/types";
import { CpmPert } from "@/components/lesson/cpm-pert";
import { CriticalPath } from "@/components/lesson/critical-path";
import { Ecosystem } from "@/components/lesson/ecosystem";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { PmbokOrigin } from "@/components/lesson/pmbok";
import { ProjectAnatomy } from "@/components/lesson/project-anatomy";
import { ProjectVsOperations } from "@/components/lesson/project-vs-operations";
import { RiskMatrix } from "@/components/lesson/risk-matrix";
import { SmartGoal } from "@/components/lesson/smart-goal";
import { Callout, Columns, Split } from "@/components/lesson/split";
import { StakeholderMap } from "@/components/lesson/stakeholder-map";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  Callout,
  Columns,
  CpmPert,
  CriticalPath,
  Ecosystem,
  FailurePrevention,
  PmbokOrigin,
  ProjectAnatomy,
  ProjectVsOperations,
  RiskMatrix,
  SmartGoal,
  Split,
  StakeholderMap,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
