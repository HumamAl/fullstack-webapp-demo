"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, Server, Zap, FileText } from "lucide-react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { BeforeAfter } from "@/components/challenges/before-after";
import { MetricBar } from "@/components/challenges/metric-bar";
import { FlowDiagram } from "@/components/challenges/flow-diagram";

export default function ChallengesPage() {
  const [showSolution, setShowSolution] = useState(false);

  const renderDifferentApproach = () => {
    const accentWord = executiveSummary.accentWord;
    if (!accentWord) return <span>{executiveSummary.differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = executiveSummary.differentApproach.split(
      new RegExp(`(${escaped})`, "i")
    );
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the key technical challenges in this project
          </p>
        </div>

        {/* Executive summary — dark hero banner */}
        <div
          className="relative overflow-hidden rounded-lg p-6 md:p-8"
          style={{
            background: "oklch(0.10 0.02 var(--primary-h, 264))",
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04), transparent 70%)",
          }}
        >
          <p className="text-sm md:text-base leading-relaxed text-white/50">
            {executiveSummary.commonApproach}
          </p>
          <hr className="my-4 border-white/10" />
          <p className="text-base md:text-lg leading-relaxed font-medium text-white/90">
            {renderDifferentApproach()}
          </p>
          <p className="text-xs text-white/40 mt-3">
            {"← "}
            <Link
              href="/"
              className="hover:text-white/60 transition-colors duration-100 underline underline-offset-2"
            >
              Back to the live demo
            </Link>
          </p>
        </div>

        {/* Challenge cards */}
        <div className="flex flex-col gap-4">

          {/* Challenge 1 — Before/After with interactive toggle */}
          <ChallengeCard
            title={challenges[0].title}
            description={challenges[0].description}
            outcome={challenges[0].outcome}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSolution(false)}
                  className={`text-xs px-3 py-1 rounded-md border transition-colors duration-100 ${
                    !showSolution
                      ? "bg-destructive/10 border-destructive/30 text-destructive font-medium"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  Current Problem
                </button>
                <button
                  onClick={() => setShowSolution(true)}
                  className={`text-xs px-3 py-1 rounded-md border transition-colors duration-100 ${
                    showSolution
                      ? "bg-[color-mix(in_oklch,var(--success)_10%,transparent)] border-[color-mix(in_oklch,var(--success)_25%,transparent)] text-[color:var(--success)] font-medium"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  With My Approach
                </button>
              </div>

              {!showSolution ? (
                <BeforeAfter
                  before={{
                    label: "Without unified gateway",
                    items: [
                      "Separate REST clients per service",
                      "Inconsistent error formats across backends",
                      "Duplicated auth logic in each service call",
                    ],
                  }}
                  after={{
                    label: "What it looks like right now",
                    items: [
                      "React components directly call Spring Boot",
                      "Node.js API errors handled differently",
                      "Token refresh logic duplicated across clients",
                    ],
                  }}
                />
              ) : (
                <BeforeAfter
                  before={{
                    label: "Problems eliminated",
                    items: [
                      "Separate REST clients per service",
                      "Inconsistent error formats across backends",
                      "Duplicated auth logic in each service call",
                    ],
                  }}
                  after={{
                    label: "With unified gateway layer",
                    items: [
                      "Unified API gateway routes to Spring Boot or Node.js",
                      "Shared TypeScript SDK with typed responses",
                      "Centralized auth middleware handles all tokens",
                    ],
                  }}
                />
              )}
            </div>
          </ChallengeCard>

          {/* Challenge 2 — Metric Bars */}
          <ChallengeCard
            title={challenges[1].title}
            description={challenges[1].description}
            outcome={challenges[1].outcome}
          >
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                Current query response times (ms)
              </p>
              <MetricBar
                label="Oracle Transaction Query"
                value={145}
                max={500}
                unit="ms"
                color="blue"
              />
              <MetricBar
                label="PostgreSQL Search Query"
                value={23}
                max={500}
                unit="ms"
                color="green"
              />
              <MetricBar
                label="Revenue Report (unoptimized)"
                value={2340}
                max={5000}
                unit="ms"
                color="red"
              />
              <MetricBar
                label="Session Validation"
                value={8}
                max={500}
                unit="ms"
                color="green"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Revenue report query is 16x slower than target — addressable with indexed materialized views and read replica routing.
              </p>
            </div>
          </ChallengeCard>

          {/* Challenge 3 — Flow Diagram */}
          <ChallengeCard
            title={challenges[2].title}
            description={challenges[2].description}
            outcome={challenges[2].outcome}
          >
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                Playwright CI orchestration pipeline
              </p>
              <FlowDiagram
                steps={[
                  {
                    label: "Test Data Setup",
                    description: "Deterministic seed",
                    icon: Database,
                  },
                  {
                    label: "Mock Services",
                    description: "Spring Boot + Node.js stubs",
                    icon: Server,
                  },
                  {
                    label: "Parallel Execution",
                    description: "Sharded across workers",
                    icon: Zap,
                    highlight: true,
                  },
                  {
                    label: "Report Generation",
                    description: "Trace + coverage export",
                    icon: FileText,
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground">
                Parallel sharding across 4 workers reduces a 20-minute sequential suite to under 5 minutes — with deterministic test data preventing flaky failures between runs.
              </p>
            </div>
          </ChallengeCard>

        </div>

        {/* CTA closer */}
        <section className="linear-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold mb-1">
                Ready to discuss the approach?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                I&apos;ve thought through the hard parts of your stack. Happy to walk through any of this on a call.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/proposal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-100"
              >
                See the proposal →
              </Link>
              <span className="text-xs font-medium bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-lg">
                Reply on Upwork to start
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
