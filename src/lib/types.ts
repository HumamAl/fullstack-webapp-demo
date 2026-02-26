import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Challenge visualization types
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// Proposal types
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ── Sprint & Project Management Types ──

export type TaskStatus = "backlog" | "in-progress" | "in-review" | "done" | "blocked";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type ServiceStatus = "healthy" | "degraded" | "down" | "maintenance";
export type TestResult = "passed" | "failed" | "skipped" | "flaky";

export interface SprintTask {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  labels: string[];
  dueDate: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasksCompleted: number;
  tasksInProgress: number;
  availability: "available" | "busy" | "offline";
}

export interface Microservice {
  id: string;
  name: string;
  stack: string;
  status: ServiceStatus;
  uptime: number;
  latency: number;
  endpoints: number;
  lastDeployed: string;
  healthCheckUrl: string;
}

export interface DatabaseQuery {
  id: string;
  name: string;
  database: "oracle" | "postgresql" | "mysql";
  avgExecutionTime: number;
  callsPerMinute: number;
  status: "optimized" | "slow" | "critical";
  lastOptimized: string;
  table: string;
}

export interface TestSuite {
  id: string;
  name: string;
  type: "e2e" | "integration" | "unit";
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
  lastRun: string;
  framework: string;
}

export interface SprintMetric {
  month: string;
  velocity: number;
  planned: number;
  completed: number;
  bugCount: number;
}

export interface DeploymentRecord {
  id: string;
  service: string;
  version: string;
  environment: "production" | "staging" | "development";
  status: "success" | "failed" | "rolling-back" | "in-progress";
  deployedAt: string;
  deployedBy: string;
  duration: number;
}
