import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most full-stack developers treat the React frontend, Spring Boot services, and Node.js microservices as separate concerns — wiring them together with ad-hoc fetch calls, inconsistent error handling, and test suites that stub everything out and never catch real integration failures.",
  differentApproach:
    "I build a unified API gateway layer with shared TypeScript interfaces across both backends, design the Oracle and PostgreSQL schemas together from the start to avoid cross-database consistency issues, and orchestrate Playwright tests against real service mocks so the CI pipeline stays under 5 minutes and actually catches regressions.",
  accentWord: "unified API gateway layer",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Unifying React Frontend with Dual Backend Architecture",
    description:
      "Managing state and API calls across a React frontend that communicates with both Spring Boot (Java) and Node.js microservices requires careful API gateway design and consistent error handling.",
    visualizationType: "before-after",
    outcome:
      "Could reduce API integration complexity by 60% through a unified gateway layer and shared TypeScript interfaces",
  },
  {
    id: "challenge-2",
    title: "Oracle + SQL Database Performance at Scale",
    description:
      "Balancing query performance between Oracle (for transactional workloads) and PostgreSQL (for analytics) while maintaining data consistency across both systems.",
    visualizationType: "metrics",
    outcome:
      "Could improve query response times by 3-5x through connection pooling, query optimization, and strategic read replica routing",
  },
  {
    id: "challenge-3",
    title: "End-to-End Testing with Playwright Across Microservices",
    description:
      "Writing reliable E2E tests with Playwright when the application depends on multiple microservices requires careful test orchestration, mock service layers, and deterministic test data.",
    visualizationType: "flow",
    outcome:
      "Could achieve 95%+ test coverage with under 5-minute CI pipeline execution through parallel test execution and smart test data management",
  },
];
