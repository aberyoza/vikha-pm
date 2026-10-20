import type { MDXComponents } from "mdx/types";
import { AuthoritySpectrum } from "@/components/lesson/authority-spectrum";
import { CashGapChart } from "@/components/lesson/cash-gap-chart";
import { CashProfile } from "@/components/lesson/cash-profile";
import { ConstraintsBalance } from "@/components/lesson/constraints-balance";
import { CpmPert } from "@/components/lesson/cpm-pert";
import { CriteriaCards } from "@/components/lesson/criteria-cards";
import { CriticalPath } from "@/components/lesson/critical-path";
import { Ecosystem } from "@/components/lesson/ecosystem";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { FormulaNote } from "@/components/lesson/formula-note";
import { IncrementalCashFlow } from "@/components/lesson/incremental-cash-flow";
import { InvestmentTypes } from "@/components/lesson/investment-types";
import { IrrExplorer } from "@/components/lesson/irr-explorer";
import { ManagerRoles } from "@/components/lesson/manager-roles";
import { MatrixReporting } from "@/components/lesson/matrix-reporting";
import { MoneyTimeline } from "@/components/lesson/money-timeline";
import { PaybackCalculator } from "@/components/lesson/payback-calculator";
import { PlanningHorizon } from "@/components/lesson/planning-horizon";
import { PmbokOrigin } from "@/components/lesson/pmbok";
import { PresentValueCalculator } from "@/components/lesson/present-value-calculator";
import { ProcessChain } from "@/components/lesson/process-chain";
import { ProcessGroupsTimeline } from "@/components/lesson/process-groups-timeline";
import { ProjectAnatomy } from "@/components/lesson/project-anatomy";
import { ProjectCashTimeline } from "@/components/lesson/project-cash-timeline";
import { ProjectInterdependence } from "@/components/lesson/project-interdependence";
import { ProjectVsOperations } from "@/components/lesson/project-vs-operations";
import { RealVsPaperMoney } from "@/components/lesson/real-vs-paper-money";
import { RiskMatrix } from "@/components/lesson/risk-matrix";
import { SevenAspects } from "@/components/lesson/seven-aspects";
import { SmartGoal } from "@/components/lesson/smart-goal";
import { Callout, Columns, Split } from "@/components/lesson/split";
import { StakeholderMap } from "@/components/lesson/stakeholder-map";
import { StructuresCompared } from "@/components/lesson/structures-compared";
import { TeamStakeholdersComms } from "@/components/lesson/team-stakeholders-comms";
import { ThreeActivities } from "@/components/lesson/three-activities";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  AuthoritySpectrum,
  Callout,
  CashGapChart,
  CashProfile,
  Columns,
  ConstraintsBalance,
  CpmPert,
  CriteriaCards,
  CriticalPath,
  Ecosystem,
  FailurePrevention,
  FormulaNote,
  IncrementalCashFlow,
  InvestmentTypes,
  IrrExplorer,
  ManagerRoles,
  MatrixReporting,
  MoneyTimeline,
  PaybackCalculator,
  PlanningHorizon,
  PmbokOrigin,
  PresentValueCalculator,
  ProcessChain,
  ProcessGroupsTimeline,
  ProjectAnatomy,
  ProjectCashTimeline,
  ProjectInterdependence,
  ProjectVsOperations,
  RealVsPaperMoney,
  RiskMatrix,
  SevenAspects,
  SmartGoal,
  Split,
  StakeholderMap,
  StructuresCompared,
  TeamStakeholdersComms,
  ThreeActivities,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
