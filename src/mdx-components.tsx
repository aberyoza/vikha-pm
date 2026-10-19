import type { MDXComponents } from "mdx/types";
import { AuthoritySpectrum } from "@/components/lesson/authority-spectrum";
import { ConstraintsBalance } from "@/components/lesson/constraints-balance";
import { CpmPert } from "@/components/lesson/cpm-pert";
import { CriticalPath } from "@/components/lesson/critical-path";
import { Ecosystem } from "@/components/lesson/ecosystem";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { MatrixReporting } from "@/components/lesson/matrix-reporting";
import { PmbokOrigin } from "@/components/lesson/pmbok";
import { ProcessChain } from "@/components/lesson/process-chain";
import { ProcessGroupsTimeline } from "@/components/lesson/process-groups-timeline";
import { ProjectAnatomy } from "@/components/lesson/project-anatomy";
import { ProjectVsOperations } from "@/components/lesson/project-vs-operations";
import { RiskMatrix } from "@/components/lesson/risk-matrix";
import { SmartGoal } from "@/components/lesson/smart-goal";
import { Callout, Columns, Split } from "@/components/lesson/split";
import { StakeholderMap } from "@/components/lesson/stakeholder-map";
import { StructuresCompared } from "@/components/lesson/structures-compared";
import { TeamStakeholdersComms } from "@/components/lesson/team-stakeholders-comms";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  AuthoritySpectrum,
  Callout,
  Columns,
  ConstraintsBalance,
  CpmPert,
  CriticalPath,
  Ecosystem,
  FailurePrevention,
  MatrixReporting,
  PmbokOrigin,
  ProcessChain,
  ProcessGroupsTimeline,
  ProjectAnatomy,
  ProjectVsOperations,
  RiskMatrix,
  SmartGoal,
  Split,
  StakeholderMap,
  StructuresCompared,
  TeamStakeholdersComms,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
