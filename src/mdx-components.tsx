import type { MDXComponents } from "mdx/types";
import { AuthoritySpectrum } from "@/components/lesson/authority-spectrum";
import { CashGapChart } from "@/components/lesson/cash-gap-chart";
import { CashProfile } from "@/components/lesson/cash-profile";
import { ConstraintsBalance } from "@/components/lesson/constraints-balance";
import { CpmExplorer } from "@/components/lesson/cpm-explorer";
import { CpmPert } from "@/components/lesson/cpm-pert";
import { CriteriaCards } from "@/components/lesson/criteria-cards";
import { CriticalPath } from "@/components/lesson/critical-path";
import { CriticalValues } from "@/components/lesson/critical-values";
import { DelayExplorer } from "@/components/lesson/delay-explorer";
import { Ecosystem } from "@/components/lesson/ecosystem";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { FormulaNote } from "@/components/lesson/formula-note";
import { GameNetwork } from "@/components/lesson/game-network";
import { GamePlanTable } from "@/components/lesson/game-plan-table";
import { IncrementalCashFlow } from "@/components/lesson/incremental-cash-flow";
import { InvestmentTypes } from "@/components/lesson/investment-types";
import { IrrExplorer } from "@/components/lesson/irr-explorer";
import { ManagerRoles } from "@/components/lesson/manager-roles";
import { MatrixReporting } from "@/components/lesson/matrix-reporting";
import { Module3Map, Module4Map, MoneyDecisionPath } from "@/components/lesson/module-maps";
import { MoneyTimeline } from "@/components/lesson/money-timeline";
import { MonteCarlo } from "@/components/lesson/monte-carlo";
import { NetworkRules } from "@/components/lesson/network-rules";
import { PaybackCalculator } from "@/components/lesson/payback-calculator";
import { PlanningHorizon } from "@/components/lesson/planning-horizon";
import { PlanningProcesses } from "@/components/lesson/planning-processes";
import { PmbokOrigin } from "@/components/lesson/pmbok";
import { PresentValueCalculator } from "@/components/lesson/present-value-calculator";
import { ProcessChain } from "@/components/lesson/process-chain";
import { ProcessGroupsTimeline } from "@/components/lesson/process-groups-timeline";
import { ProjectAnatomy } from "@/components/lesson/project-anatomy";
import { ProjectCashTimeline } from "@/components/lesson/project-cash-timeline";
import { ProjectInterdependence } from "@/components/lesson/project-interdependence";
import { ProjectVsOperations } from "@/components/lesson/project-vs-operations";
import { RealVsPaperMoney } from "@/components/lesson/real-vs-paper-money";
import { ReserveCoverage } from "@/components/lesson/reserve-coverage";
import { RiskControl } from "@/components/lesson/risk-control";
import { RiskLog } from "@/components/lesson/risk-log";
import { RiskMatrix } from "@/components/lesson/risk-matrix";
import { RiskRegister } from "@/components/lesson/risk-register";
import { RiskResponses } from "@/components/lesson/risk-responses";
import { RiskRose } from "@/components/lesson/risk-rose";
import { ScenarioCalculator } from "@/components/lesson/scenario-calculator";
import { SensitivityExplorer } from "@/components/lesson/sensitivity-explorer";
import { SevenAspects } from "@/components/lesson/seven-aspects";
import { SmartGoal } from "@/components/lesson/smart-goal";
import { Callout, Columns, Split, Wide } from "@/components/lesson/split";
import { StakeholderMap } from "@/components/lesson/stakeholder-map";
import { StructuresCompared } from "@/components/lesson/structures-compared";
import { TeamStakeholdersComms } from "@/components/lesson/team-stakeholders-comms";
import { ThreeActivities } from "@/components/lesson/three-activities";
import { UncertaintyVsRisk } from "@/components/lesson/uncertainty-vs-risk";
import { WbsMethods } from "@/components/lesson/wbs-methods";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  AuthoritySpectrum,
  Callout,
  CashGapChart,
  CashProfile,
  Columns,
  ConstraintsBalance,
  CpmExplorer,
  CpmPert,
  CriteriaCards,
  CriticalPath,
  CriticalValues,
  DelayExplorer,
  Ecosystem,
  FailurePrevention,
  FormulaNote,
  GameNetwork,
  GamePlanTable,
  IncrementalCashFlow,
  InvestmentTypes,
  IrrExplorer,
  ManagerRoles,
  MatrixReporting,
  Module3Map,
  Module4Map,
  MoneyDecisionPath,
  MoneyTimeline,
  MonteCarlo,
  NetworkRules,
  PaybackCalculator,
  PlanningHorizon,
  PlanningProcesses,
  PmbokOrigin,
  PresentValueCalculator,
  ProcessChain,
  ProcessGroupsTimeline,
  ProjectAnatomy,
  ProjectCashTimeline,
  ProjectInterdependence,
  ProjectVsOperations,
  RealVsPaperMoney,
  ReserveCoverage,
  RiskControl,
  RiskLog,
  RiskMatrix,
  RiskRegister,
  RiskResponses,
  RiskRose,
  ScenarioCalculator,
  SensitivityExplorer,
  SevenAspects,
  SmartGoal,
  Split,
  StakeholderMap,
  StructuresCompared,
  TeamStakeholdersComms,
  ThreeActivities,
  UncertaintyVsRisk,
  WbsMethods,
  Wide,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
