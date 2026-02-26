import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer who builds production React + Java applications — clean architecture, tested code, shipped fast.",
  bio: "I build web applications that handle real production workloads. React frontends with proper state management (Redux, React Query, Context API), Java Spring Boot microservices, Node.js APIs, and databases that don't fall over at scale. This demo shows a sprint management dashboard built with the same stack you're looking for.",
  approach: [
    {
      title: "Audit the Existing Codebase",
      description:
        "Understand current architecture, identify technical debt, map the service boundaries",
    },
    {
      title: "Build Feature-by-Feature",
      description:
        "React components with Material UI, backed by Spring Boot or Node.js services — working code every day",
    },
    {
      title: "Test Everything with Playwright",
      description:
        "E2E tests for critical flows, integration tests for APIs, visual regression for UI components",
    },
    {
      title: "Ship and Iterate",
      description:
        "Deploy to staging daily, production weekly — short feedback loops, no surprises",
    },
  ],
  skillCategories: [
    {
      name: "Frontend",
      skills: [
        "React",
        "TypeScript",
        "Material UI",
        "Redux Toolkit",
        "React Query",
        "Context API",
        "Next.js",
      ],
    },
    {
      name: "Backend",
      skills: [
        "Java Spring Boot",
        "Node.js",
        "GraphQL",
        "REST APIs",
        "Microservices",
        "Kotlin",
      ],
    },
    {
      name: "Database",
      skills: [
        "Oracle",
        "PostgreSQL",
        "MySQL",
        "SQL Optimization",
        "Connection Pooling",
      ],
    },
    {
      name: "Testing & DevOps",
      skills: ["Playwright", "JUnit 5", "Jest", "CI/CD", "Docker", "Vercel"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "data-intelligence",
    title: "Data Intelligence Platform",
    description:
      "Multi-source data analytics dashboard with interactive charts, filterable insights, and real-time aggregation",
    tech: ["React", "TypeScript", "Node.js", "Recharts"],
    relevance:
      "Full-stack dashboard with complex data visualization — same pattern as your web app",
    outcome:
      "Unified analytics pulling from multiple data sources with interactive filtering",
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
  },
  {
    id: "fleet-saas",
    title: "Fleet Maintenance SaaS",
    description:
      "6-module SaaS covering asset tracking, work orders, preventive maintenance, inspections, parts inventory, and analytics",
    tech: ["React", "TypeScript", "Recharts", "REST APIs"],
    relevance:
      "Multi-module SaaS with complex data relationships — mirrors microservice architecture",
    outcome:
      "Full maintenance lifecycle management with real-time dashboards and scheduling",
  },
  {
    id: "dealerhub",
    title: "DealerHub — Automotive SaaS",
    description:
      "Multi-tenant automotive platform with inventory management, lead scoring, appraisals, and reconditioning pipeline",
    tech: ["React", "TypeScript", "REST APIs", "Recharts"],
    relevance: "Production-grade CRUD + dashboards across multiple data domains",
    outcome:
      "End-to-end dealership operations — inventory, leads, appraisals all in one platform",
    liveUrl: "https://dealer-platform-neon.vercel.app",
  },
  {
    id: "payguard",
    title: "PayGuard — Transaction Monitor",
    description:
      "Real-time transaction monitoring with flagging, linked account tracking, alert management, and merchant detection",
    tech: ["React", "TypeScript", "Node.js", "Recharts"],
    relevance:
      "High-volume data processing with real-time UI updates — similar testing requirements",
    outcome:
      "Compliance monitoring with transaction flagging and multi-account linking",
    liveUrl: "https://payment-monitor.vercel.app",
  },
];
