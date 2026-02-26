"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { testSuites } from "@/data/mock-data";
import type { TestSuite } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";

type SuiteType = TestSuite["type"];

function TypeBadge({ type }: { type: SuiteType }) {
  const config: Record<SuiteType, { label: string; cls: string }> = {
    e2e:         { label: "E2E",         cls: "border-purple-500/30 text-purple-600 bg-purple-500/8"   },
    integration: { label: "Integration", cls: "border-blue-500/30 text-blue-600 bg-blue-500/8"         },
    unit:        { label: "Unit",        cls: "border-emerald-500/30 text-emerald-600 bg-emerald-500/8" },
  };
  const { label, cls } = config[type];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border rounded-sm px-1.5 py-0", cls)}>
      {label}
    </Badge>
  );
}

function FrameworkBadge({ fw }: { fw: string }) {
  return (
    <Badge variant="outline" className="text-[11px] font-mono border border-border/60 text-muted-foreground bg-muted/40 rounded-sm px-1.5 py-0">
      {fw}
    </Badge>
  );
}

function ResultBar({ suite }: { suite: TestSuite }) {
  const total = suite.totalTests;
  const passedPct  = (suite.passed  / total) * 100;
  const failedPct  = (suite.failed  / total) * 100;
  const skippedPct = (suite.skipped / total) * 100;

  return (
    <div className="space-y-1">
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden flex">
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${passedPct}%`, backgroundColor: "color-mix(in oklch, var(--success) 100%, transparent 0%)" }}
        />
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${failedPct}%`, backgroundColor: "hsl(var(--destructive))" }}
        />
        <div
          className="h-full bg-muted-foreground/30 transition-all duration-150"
          style={{ width: `${skippedPct}%` }}
        />
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1 text-[color:var(--success)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" />
          {suite.passed} passed
        </span>
        {suite.failed > 0 && (
          <span className="flex items-center gap-1 text-destructive">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
            {suite.failed} failed
          </span>
        )}
        {suite.skipped > 0 && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block" />
            {suite.skipped} skipped
          </span>
        )}
        {suite.flaky > 0 && (
          <span className="flex items-center gap-1 text-[color:var(--warning)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--warning)] inline-block" />
            {suite.flaky} flaky
          </span>
        )}
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms >= 60000) return `${(ms / 60000).toFixed(1)}m`;
  if (ms >= 1000)  return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

function formatLastRun(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function SuiteCard({ suite }: { suite: TestSuite }) {
  const passRate = suite.totalTests > 0
    ? ((suite.passed / suite.totalTests) * 100).toFixed(1)
    : "0.0";
  const allPass = suite.failed === 0 && suite.skipped === 0;

  return (
    <div className={cn(
      "linear-card flex flex-col gap-3 transition-colors duration-100",
      suite.failed > 0 && "border-destructive/20"
    )} style={{ padding: "var(--card-padding)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 mt-0.5",
            allPass ? "bg-[color:var(--success)]" : suite.failed > 0 ? "bg-destructive" : "bg-[color:var(--warning)]"
          )} />
          <span className="font-semibold text-sm leading-tight">{suite.name}</span>
        </div>
        <TypeBadge type={suite.type} />
      </div>

      {/* Framework + duration */}
      <div className="flex items-center gap-2">
        <FrameworkBadge fw={suite.framework} />
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDuration(suite.duration * 1000)}
        </span>
      </div>

      {/* Pass rate */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {suite.totalTests} tests
        </span>
        <span className={cn(
          "font-mono font-semibold",
          parseFloat(passRate) >= 99 ? "text-[color:var(--success)]" :
          parseFloat(passRate) >= 90 ? "text-[color:var(--warning)]" : "text-destructive"
        )}>
          {passRate}% pass
        </span>
      </div>

      {/* Result bar */}
      <ResultBar suite={suite} />

      {/* Last run */}
      <p className="text-[11px] text-muted-foreground">
        Last run: {formatLastRun(suite.lastRun)}
      </p>
    </div>
  );
}

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all",         label: "All Types"   },
  { value: "e2e",         label: "E2E"         },
  { value: "integration", label: "Integration" },
  { value: "unit",        label: "Unit"        },
];

export default function TestsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const displayed = useMemo(() => {
    return testSuites.filter((s) => typeFilter === "all" || s.type === typeFilter);
  }, [typeFilter]);

  // Summary stats
  const totalTests   = testSuites.reduce((s, t) => s + t.totalTests, 0);
  const totalPassed  = testSuites.reduce((s, t) => s + t.passed, 0);
  const totalFailed  = testSuites.reduce((s, t) => s + t.failed, 0);
  const totalFlaky   = testSuites.reduce((s, t) => s + t.flaky, 0);
  const passRate     = ((totalPassed / totalTests) * 100).toFixed(1);
  const avgDuration  = Math.round(
    testSuites.reduce((s, t) => s + t.duration, 0) / testSuites.length
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Suites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Playwright, JUnit 5, and Jest — CI run results across all services
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Play className="w-3.5 h-3.5" />
          Run All
        </Button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total Tests</p>
          <p className="text-2xl font-bold font-mono mt-1">{totalTests}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Pass Rate</p>
          <p className={cn(
            "text-2xl font-bold font-mono mt-1",
            parseFloat(passRate) >= 99 ? "text-[color:var(--success)]" : "text-[color:var(--warning)]"
          )}>
            {passRate}%
          </p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Failed</p>
          <p className={cn("text-2xl font-bold font-mono mt-1", totalFailed > 0 ? "text-destructive" : "text-[color:var(--success)]")}>
            {totalFailed}
          </p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Flaky / Avg Duration</p>
          <p className="text-2xl font-bold font-mono mt-1">
            {totalFlaky} <span className="text-sm text-muted-foreground font-normal">/ {avgDuration}s</span>
          </p>
        </div>
      </div>

      {/* Type filter — pill toggles */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-md border border-border/60 bg-muted/30">
          {TYPE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setTypeFilter(o.value)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-colors duration-100",
                typeFilter === o.value
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "suite" : "suites"}
        </span>
      </div>

      {/* Suite cards grid */}
      {displayed.length === 0 ? (
        <div className="linear-card flex items-center justify-center h-48" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm text-muted-foreground">No test suites match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((suite) => (
            <SuiteCard key={suite.id} suite={suite} />
          ))}
        </div>
      )}
    </div>
  );
}
