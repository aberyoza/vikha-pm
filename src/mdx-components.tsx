import type { MDXComponents } from "mdx/types";
import { AonVsAoa } from "@/components/lesson/aon-vs-aoa";
import { ApproachSelector } from "@/components/lesson/approach-selector";
import { AuthoritySpectrum } from "@/components/lesson/authority-spectrum";
import { BurndownChart } from "@/components/lesson/burndown-chart";
import { CashGapChart } from "@/components/lesson/cash-gap-chart";
import { CashProfile } from "@/components/lesson/cash-profile";
import { ChangeImpact } from "@/components/lesson/change-impact";
import { ChannelsCounter } from "@/components/lesson/channels-counter";
import { CharterCard } from "@/components/lesson/charter-card";
import { CommModel } from "@/components/lesson/comm-model";
import { CommPlan } from "@/components/lesson/comm-plan";
import { ConstraintsBalance } from "@/components/lesson/constraints-balance";
import { CourseMap } from "@/components/lesson/course-map";
import { CpmExplorer } from "@/components/lesson/cpm-explorer";
import { CriteriaCards } from "@/components/lesson/criteria-cards";
import { CriticalPath } from "@/components/lesson/critical-path";
import { CriticalValues } from "@/components/lesson/critical-values";
import { DecisionRights } from "@/components/lesson/decision-rights";
import { DefectCost } from "@/components/lesson/defect-cost";
import { DelayExplorer } from "@/components/lesson/delay-explorer";
import { DevelopmentApproaches } from "@/components/lesson/development-approaches";
import { EngagementMatrix } from "@/components/lesson/engagement-matrix";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { FormulaNote } from "@/components/lesson/formula-note";
import { GameNetwork } from "@/components/lesson/game-network";
import { GamePlanTable } from "@/components/lesson/game-plan-table";
import { GroupDecision } from "@/components/lesson/group-decision";
import { InvestmentTypes } from "@/components/lesson/investment-types";
import { IrrExplorer } from "@/components/lesson/irr-explorer";
import { LagTypes } from "@/components/lesson/lag-types";
import { LeaderAdmin } from "@/components/lesson/leader-admin";
import { LifeCycleGates } from "@/components/lesson/life-cycle-gates";
import { ManagerRoles } from "@/components/lesson/manager-roles";
import { MatrixReporting } from "@/components/lesson/matrix-reporting";
import { MoneyTimeline } from "@/components/lesson/money-timeline";
import { MonteCarlo } from "@/components/lesson/monte-carlo";
import { NetworkRules } from "@/components/lesson/network-rules";
import { PaybackCalculator } from "@/components/lesson/payback-calculator";
import { PertCalculator } from "@/components/lesson/pert-calculator";
import { PlanStack } from "@/components/lesson/plan-stack";
import { PmbokOrigin } from "@/components/lesson/pmbok";
import { PmbokEditions } from "@/components/lesson/pmbok-editions";
import { PowerInterestGrid } from "@/components/lesson/power-interest-grid";
import { PresentValueCalculator } from "@/components/lesson/present-value-calculator";
import { PrinciplesCompare } from "@/components/lesson/principles-compare";
import { ProcessChain } from "@/components/lesson/process-chain";
import { ProcessGroupsTimeline } from "@/components/lesson/process-groups-timeline";
import { ProjectAnatomy } from "@/components/lesson/project-anatomy";
import { ProjectCashTimeline } from "@/components/lesson/project-cash-timeline";
import { ProjectInterdependence } from "@/components/lesson/project-interdependence";
import { ProjectVsOperations } from "@/components/lesson/project-vs-operations";
import { RealVsPaperMoney } from "@/components/lesson/real-vs-paper-money";
import { ReserveCoverage } from "@/components/lesson/reserve-coverage";
import { RiskControl } from "@/components/lesson/risk-control";
import { RiskHeatmap } from "@/components/lesson/risk-heatmap";
import { RiskLog } from "@/components/lesson/risk-log";
import { RiskRegister } from "@/components/lesson/risk-register";
import { RiskResponses } from "@/components/lesson/risk-responses";
import { RiskRose } from "@/components/lesson/risk-rose";
import { ScenarioCalculator } from "@/components/lesson/scenario-calculator";
import { ScopeCreep } from "@/components/lesson/scope-creep";
import { ScopeProcesses } from "@/components/lesson/scope-processes";
import { ScopeStatement } from "@/components/lesson/scope-statement";
import { SensitivityExplorer } from "@/components/lesson/sensitivity-explorer";
import { SevenAspects } from "@/components/lesson/seven-aspects";
import { SmartGoal } from "@/components/lesson/smart-goal";
import { Callout, Columns, Split, Wide } from "@/components/lesson/split";
import { StakeholderMap } from "@/components/lesson/stakeholder-map";
import { StakeholderRegister } from "@/components/lesson/stakeholder-register";
import { StatusReport } from "@/components/lesson/status-report";
import { StepMethod } from "@/components/lesson/step-method";
import { StructuresCompared } from "@/components/lesson/structures-compared";
import { SustainabilityPillars } from "@/components/lesson/sustainability-pillars";
import { TailoringChoices } from "@/components/lesson/tailoring-choices";
import { TeamStakeholdersComms } from "@/components/lesson/team-stakeholders-comms";
import { ThreeActivities } from "@/components/lesson/three-activities";
import { TraceabilityMatrix } from "@/components/lesson/traceability-matrix";
import { UncertaintyTypes } from "@/components/lesson/uncertainty-types";
import { ValidateFlow } from "@/components/lesson/validate-flow";
import { ValueChain } from "@/components/lesson/value-chain";
import { WbsCodes } from "@/components/lesson/wbs-codes";
import { WbsMethods } from "@/components/lesson/wbs-methods";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  AonVsAoa,
  ApproachSelector,
  AuthoritySpectrum,
  BurndownChart,
  Callout,
  CashGapChart,
  CashProfile,
  ChangeImpact,
  ChannelsCounter,
  CharterCard,
  Columns,
  CommModel,
  CommPlan,
  ConstraintsBalance,
  CourseMap,
  CpmExplorer,
  CriteriaCards,
  CriticalPath,
  CriticalValues,
  DecisionRights,
  DefectCost,
  DelayExplorer,
  DevelopmentApproaches,
  EngagementMatrix,
  FailurePrevention,
  FormulaNote,
  GameNetwork,
  GamePlanTable,
  GroupDecision,
  InvestmentTypes,
  IrrExplorer,
  LagTypes,
  LeaderAdmin,
  LifeCycleGates,
  ManagerRoles,
  MatrixReporting,
  MoneyTimeline,
  MonteCarlo,
  NetworkRules,
  PaybackCalculator,
  PertCalculator,
  PlanStack,
  PmbokEditions,
  PmbokOrigin,
  PowerInterestGrid,
  PresentValueCalculator,
  PrinciplesCompare,
  ProcessChain,
  ProcessGroupsTimeline,
  ProjectAnatomy,
  ProjectCashTimeline,
  ProjectInterdependence,
  ProjectVsOperations,
  RealVsPaperMoney,
  ReserveCoverage,
  RiskControl,
  RiskHeatmap,
  RiskLog,
  RiskRegister,
  RiskResponses,
  RiskRose,
  ScenarioCalculator,
  ScopeCreep,
  ScopeProcesses,
  ScopeStatement,
  SensitivityExplorer,
  SevenAspects,
  SmartGoal,
  Split,
  StakeholderMap,
  StakeholderRegister,
  StatusReport,
  StepMethod,
  StructuresCompared,
  SustainabilityPillars,
  TailoringChoices,
  TeamStakeholdersComms,
  ThreeActivities,
  TraceabilityMatrix,
  UncertaintyTypes,
  ValidateFlow,
  ValueChain,
  WbsCodes,
  WbsMethods,
  Wide,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
