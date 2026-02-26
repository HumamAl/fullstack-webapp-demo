"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { sprintTasks, sprintMetrics, microservices } from "@/data/mock-data";
import { APP_CONFIG } from "@/lib/config";
import type { SprintTask, TaskStatus, TaskPriority } from "@/lib/types";
import {
  Zap,
  GitMerge,
  CheckCircle2,
  Server,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

// ── SSR-safe chart import ────────────────────────────────────────────────────
const SprintVelocityChart = dynamic(
  () =>
    import("@/components/dashboard/sprint-velocity-chart").then(
      (m) => m.SprintVelocityChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

// ── useCountUp hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1100, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const raw = eased * target;
            setCount(parseFloat(raw.toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { count, ref };
}

// ── Status / Priority badge helpers ─────────────────────────────────────────
const STATUS_STYLES: Record<TaskStatus, string> = {
  done: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
  "in-progress": "bg-primary/10 text-primary",
  "in-review": "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  blocked: "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]",
  backlog: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  done: "Done",
  "in-progress": "In Progress",
  "in-review": "In Review",
  blocked: "Blocked",
  backlog: "Backlog",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  critical: "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]",
  high: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

// ── Stat Card component ──────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  accentClass?: string;
}

function StatCard({
  title,
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  description,
  icon,
  index,
  accentClass = "",
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 1100, decimals);
  const displayVal = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);

  return (
    <div
      ref={ref}
      className="linear-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span
          className={`p-1.5 rounded ${accentClass || "bg-primary/10 text-primary"}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold font-mono tabular-nums tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {prefix}
        {displayVal}
        {suffix}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

// ── Filter button component ──────────────────────────────────────────────────
type TaskFilter = "all" | "in-progress" | "blocked";

interface FilterBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterBtn({ label, active, onClick }: FilterBtnProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 text-xs rounded border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      ].join(" ")}
      style={{ transitionDuration: "var(--dur-fast)" }}
    >
      {label}
    </button>
  );
}

// ── Services status indicator ────────────────────────────────────────────────
const SERVICE_DOT: Record<string, string> = {
  healthy: "var(--success)",
  degraded: "var(--warning)",
  down: "var(--destructive)",
  maintenance: "var(--muted-foreground)",
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [chartView, setChartView] = useState<"velocity" | "bugs">("velocity");

  // Derived stats
  const inProgressCount = sprintTasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const blockedCount = sprintTasks.filter((t) => t.status === "blocked").length;

  const servicesOnline = microservices.filter(
    (s) => s.status === "healthy"
  ).length;

  // Filtered tasks — the working filter
  const filteredTasks = useMemo<SprintTask[]>(() => {
    if (taskFilter === "all") return sprintTasks;
    return sprintTasks.filter((t) => t.status === taskFilter);
  }, [taskFilter]);

  // Compute sprint pass rate from test suites (mocked inline)
  const testPassRate = 97.2;

  const projectName =
    APP_CONFIG.clientName ?? APP_CONFIG.projectName;

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sprint Command Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sprint 14 · Feb 17 – Mar 2, 2026 · 15 tasks tracked
        </p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Sprint Velocity"
          value={48}
          suffix=" pts"
          description="+6 pts vs last sprint · on track to hit 52"
          icon={<Zap className="w-4 h-4" />}
          accentClass="bg-primary/10 text-primary"
        />
        <StatCard
          index={1}
          title="Tasks In Progress"
          value={inProgressCount}
          description={`${blockedCount} blocked · ${sprintTasks.filter(t => t.status === "in-review").length} awaiting review`}
          icon={<GitMerge className="w-4 h-4" />}
          accentClass="bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
        />
        <StatCard
          index={2}
          title="Test Pass Rate"
          value={testPassRate}
          decimals={1}
          suffix="%"
          description="315 tests · 4 failing · 2 flaky suites"
          icon={<CheckCircle2 className="w-4 h-4" />}
          accentClass="bg-[color:var(--success)]/10 text-[color:var(--success)]"
        />
        <StatCard
          index={3}
          title="Services Online"
          value={servicesOnline}
          suffix={`/${microservices.length}`}
          description="1 degraded · 1 in maintenance · 0 down"
          icon={<Server className="w-4 h-4" />}
          accentClass="bg-primary/10 text-primary"
        />
      </div>

      {/* ── Sprint Velocity Chart ──────────────────────────────────────── */}
      <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              {chartView === "velocity" ? "Sprint Velocity Trend" : "Bug Count per Sprint"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {chartView === "velocity"
                ? "Story points completed vs. planned — last 6 sprints"
                : "Defects introduced per sprint cycle"}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <FilterBtn
              label="Velocity"
              active={chartView === "velocity"}
              onClick={() => setChartView("velocity")}
            />
            <FilterBtn
              label="Bug Count"
              active={chartView === "bugs"}
              onClick={() => setChartView("bugs")}
            />
          </div>
        </div>
        <SprintVelocityChart data={sprintMetrics} view={chartView} />
      </div>

      {/* ── Sprint Tasks + Service Health side-by-side ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks table — takes 2/3 width on large screens */}
        <div
          className="linear-card lg:col-span-2"
          style={{ padding: "var(--card-padding)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Current Sprint Tasks
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {filteredTasks.length} of {sprintTasks.length} tasks
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <FilterBtn
                label="All"
                active={taskFilter === "all"}
                onClick={() => setTaskFilter("all")}
              />
              <FilterBtn
                label="In Progress"
                active={taskFilter === "in-progress"}
                onClick={() => setTaskFilter("in-progress")}
              />
              <FilterBtn
                label="Blocked"
                active={taskFilter === "blocked"}
                onClick={() => setTaskFilter("blocked")}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-3">
                    Task
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-3 whitespace-nowrap">
                    Assignee
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-3">
                    Priority
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-2 whitespace-nowrap">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-border/40 last:border-0 linear-hover"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="flex items-start gap-2">
                        {task.status === "blocked" && (
                          <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--destructive)] mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-xs leading-snug line-clamp-1">
                            {task.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            {task.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-muted-foreground whitespace-nowrap">
                      {task.assignee.split(" ")[0]}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${STATUS_STYLES[task.status]}`}
                      >
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium capitalize whitespace-nowrap ${PRIORITY_STYLES[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs font-semibold text-muted-foreground">
                      {task.storyPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Health panel — 1/3 width */}
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight">
              Service Health
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {servicesOnline}/{microservices.length} services operational
            </p>
          </div>

          <div className="space-y-2">
            {microservices.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center justify-between py-1.5 linear-hover rounded px-1 -mx-1"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: SERVICE_DOT[svc.status] ?? "var(--muted-foreground)",
                    }}
                  />
                  <span className="text-xs font-mono truncate">{svc.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {svc.latency > 0 && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {svc.latency}ms
                    </span>
                  )}
                  <span
                    className={[
                      "text-[10px] font-medium capitalize px-1.5 py-0.5 rounded",
                      svc.status === "healthy"
                        ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                        : svc.status === "degraded"
                        ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                        : svc.status === "down"
                        ? "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border/40">
            <a
              href="/services"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              View service details
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Banner ─────────────────────────────────────────────── */}
      <div
        className="linear-card p-4 border-primary/15"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklch, var(--primary), transparent 92%), transparent)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">
              This is a live demo built for {projectName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Humam · Full-Stack Developer · Available now
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/challenges"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              My approach →
            </a>
            <a
              href="/proposal"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              Work with me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
