import type { MDXComponents } from "mdx/types";
import { AccuracyFunnel } from "@/components/lesson/accuracy-funnel";
import { AgileTraps } from "@/components/lesson/agile-traps";
import { AonVsAoa } from "@/components/lesson/aon-vs-aoa";
import { ApproachSelector } from "@/components/lesson/approach-selector";
import { AuthoritySpectrum } from "@/components/lesson/authority-spectrum";
import { BudgetCurve } from "@/components/lesson/budget-curve";
import { BudgetTable } from "@/components/lesson/budget-table";
import { BurndownChart } from "@/components/lesson/burndown-chart";
import { CashGapChart } from "@/components/lesson/cash-gap-chart";
import { CashProfile } from "@/components/lesson/cash-profile";
import { ChangeImpact } from "@/components/lesson/change-impact";
import { ChannelsCounter } from "@/components/lesson/channels-counter";
import { CharterCard } from "@/components/lesson/charter-card";
import { CommModel } from "@/components/lesson/comm-model";
import { CommPlan } from "@/components/lesson/comm-plan";
import { ConflictModes } from "@/components/lesson/conflict-modes";
import { ConstraintsBalance } from "@/components/lesson/constraints-balance";
import { ContractTypes } from "@/components/lesson/contract-types";
import { ControlChart } from "@/components/lesson/control-chart";
import { CostOfQuality } from "@/components/lesson/cost-of-quality";
import { CourseMap } from "@/components/lesson/course-map";
import { CpmExplorer } from "@/components/lesson/cpm-explorer";
import { CriteriaCards } from "@/components/lesson/criteria-cards";
import { CriticalPath } from "@/components/lesson/critical-path";
import { CriticalValues } from "@/components/lesson/critical-values";
import { CumulativeFlow } from "@/components/lesson/cumulative-flow";
import { DecisionRights } from "@/components/lesson/decision-rights";
import { DefectCost } from "@/components/lesson/defect-cost";
import { DelayExplorer } from "@/components/lesson/delay-explorer";
import { DevelopmentApproaches } from "@/components/lesson/development-approaches";
import { EngagementMatrix } from "@/components/lesson/engagement-matrix";
import { EvmExplorer } from "@/components/lesson/evm-explorer";
import { EvmForecast } from "@/components/lesson/evm-forecast";
import { FailurePrevention } from "@/components/lesson/failure-prevention";
import { Fishbone } from "@/components/lesson/fishbone";
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
import { ManifestoBalance } from "@/components/lesson/manifesto-balance";
import { MatrixReporting } from "@/components/lesson/matrix-reporting";
import { MoneyTimeline } from "@/components/lesson/money-timeline";
import { MonteCarlo } from "@/components/lesson/monte-carlo";
import { MotivationDrivers } from "@/components/lesson/motivation-drivers";
import { NetworkRules } from "@/components/lesson/network-rules";
import { ParetoChart } from "@/components/lesson/pareto-chart";
import { PaybackCalculator } from "@/components/lesson/payback-calculator";
import { PdcaCycle } from "@/components/lesson/pdca-cycle";
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
import { QualityActivities } from "@/components/lesson/quality-activities";
import { QualityGrade } from "@/components/lesson/quality-grade";
import { QualityScorecard } from "@/components/lesson/quality-scorecard";
import { RaciMatrix } from "@/components/lesson/raci-matrix";
import { RealVsPaperMoney } from "@/components/lesson/real-vs-paper-money";
import { ReserveCoverage } from "@/components/lesson/reserve-coverage";
import { ResourceHistogram, ResourceLeveling } from "@/components/lesson/resource-leveling";
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
import { ScrumArtifacts } from "@/components/lesson/scrum-artifacts";
import { ScrumOrKanban } from "@/components/lesson/scrum-or-kanban";
import { ScrumSprint } from "@/components/lesson/scrum-sprint";
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
import { SynergyBars } from "@/components/lesson/synergy-bars";
import { TailoringChoices } from "@/components/lesson/tailoring-choices";
import { TeamStakeholdersComms } from "@/components/lesson/team-stakeholders-comms";
import { ThreeActivities } from "@/components/lesson/three-activities";
import { TraceabilityMatrix } from "@/components/lesson/traceability-matrix";
import { TuckmanCurve } from "@/components/lesson/tuckman-curve";
import { UncertaintyTypes } from "@/components/lesson/uncertainty-types";
import { ValidateFlow } from "@/components/lesson/validate-flow";
import { ValueChain } from "@/components/lesson/value-chain";
import { VendorMatrix } from "@/components/lesson/vendor-matrix";
import { WbsCodes } from "@/components/lesson/wbs-codes";
import { WbsMethods } from "@/components/lesson/wbs-methods";
import { WipLimit } from "@/components/lesson/wip-limit";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  AccuracyFunnel,
  AgileTraps,
  AonVsAoa,
  ApproachSelector,
  AuthoritySpectrum,
  BudgetCurve,
  BudgetTable,
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
  ConflictModes,
  ConstraintsBalance,
  ContractTypes,
  ControlChart,
  CostOfQuality,
  CourseMap,
  CpmExplorer,
  CriteriaCards,
  CriticalPath,
  CriticalValues,
  CumulativeFlow,
  DecisionRights,
  DefectCost,
  DelayExplorer,
  DevelopmentApproaches,
  EngagementMatrix,
  EvmExplorer,
  EvmForecast,
  FailurePrevention,
  Fishbone,
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
  ManifestoBalance,
  MatrixReporting,
  MoneyTimeline,
  MonteCarlo,
  MotivationDrivers,
  NetworkRules,
  ParetoChart,
  PaybackCalculator,
  PdcaCycle,
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
  QualityActivities,
  QualityGrade,
  QualityScorecard,
  RaciMatrix,
  RealVsPaperMoney,
  ReserveCoverage,
  ResourceHistogram,
  ResourceLeveling,
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
  ScrumArtifacts,
  ScrumOrKanban,
  ScrumSprint,
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
  SynergyBars,
  TailoringChoices,
  TeamStakeholdersComms,
  ThreeActivities,
  TraceabilityMatrix,
  TuckmanCurve,
  UncertaintyTypes,
  ValidateFlow,
  ValueChain,
  VendorMatrix,
  WbsCodes,
  WbsMethods,
  Wide,
  WipLimit,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
