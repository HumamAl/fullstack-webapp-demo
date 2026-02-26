"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { microservices } from "@/data/mock-data";
import type { Microservice, ServiceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Server } from "lucide-react";

function ServiceStatusDot({ status }: { status: ServiceStatus }) {
  const config: Record<ServiceStatus, { color: string; pulse: boolean }> = {
    healthy:     { color: "bg-[color:var(--success)]", pulse: false },
    degraded:    { color: "bg-[color:var(--warning)]",  pulse: true  },
    down:        { color: "bg-destructive",              pulse: true  },
    maintenance: { color: "bg-muted-foreground",         pulse: false },
  };
  const { color, pulse } = config[status];
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", color)} />
      )}
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", color)} />
    </span>
  );
}

function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const config: Record<ServiceStatus, { label: string; cls: string }> = {
    healthy:     { label: "Healthy",     cls: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
    degraded:    { label: "Degraded",    cls: "text-[color:var(--warning)] bg-[color:var(--warning)]/10"  },
    down:        { label: "Down",        cls: "text-destructive bg-destructive/10"                         },
    maintenance: { label: "Maintenance", cls: "text-muted-foreground bg-muted"                             },
  };
  const { label, cls } = config[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border-0 rounded-full tabular-nums", cls)}>
      {label}
    </Badge>
  );
}

function StackBadge({ stack }: { stack: string }) {
  const isSpring = stack === "Spring Boot";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium border rounded-sm px-1.5 py-0",
        isSpring
          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/8"
          : "border-sky-500/30 text-sky-600 bg-sky-500/8"
      )}
    >
      {stack}
    </Badge>
  );
}

function UptimeBar({ uptime }: { uptime: number }) {
  const color =
    uptime >= 99.9 ? "var(--success)" :
    uptime >= 98   ? "var(--warning)" : "var(--destructive, hsl(var(--destructive)))";
  return (
    <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-150"
        style={{ width: `${uptime}%`, background: `color-mix(in oklch, ${color} 100%, transparent 0%)` }}
      />
    </div>
  );
}

function ServiceCard({ svc }: { svc: Microservice }) {
  return (
    <div className="linear-card flex flex-col gap-3" style={{ padding: "var(--card-padding)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ServiceStatusDot status={svc.status} />
          <span className="font-mono text-sm font-semibold truncate">{svc.name}</span>
        </div>
        <ServiceStatusBadge status={svc.status} />
      </div>

      {/* Stack badge */}
      <StackBadge stack={svc.stack} />

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Uptime</p>
          <p className="font-mono text-sm font-semibold">{svc.uptime.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Latency</p>
          <p className="font-mono text-sm font-semibold">
            {svc.status === "maintenance" ? "—" : `${svc.latency}ms`}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Endpoints</p>
          <p className="font-mono text-sm font-semibold">{svc.endpoints}</p>
        </div>
      </div>

      {/* Uptime bar */}
      <UptimeBar uptime={svc.uptime} />

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-mono truncate">{svc.healthCheckUrl}</span>
        <span>Deployed {svc.lastDeployed}</span>
      </div>
    </div>
  );
}

const STACK_OPTIONS = ["all", "Spring Boot", "Node.js"] as const;
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all",      label: "All Statuses" },
  { value: "healthy",     label: "Healthy"     },
  { value: "issues",      label: "Issues"      },
];

export default function ServicesPage() {
  const [stackFilter, setStackFilter]   = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const displayed = useMemo(() => {
    return microservices.filter((svc) => {
      const stackOk  = stackFilter  === "all" || svc.stack === stackFilter;
      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "healthy" && svc.status === "healthy") ||
        (statusFilter === "issues"  && svc.status !== "healthy");
      return stackOk && statusOk;
    });
  }, [stackFilter, statusFilter]);

  const healthySummary = microservices.filter(s => s.status === "healthy").length;
  const degradedSummary = microservices.filter(s => s.status === "degraded" || s.status === "down").length;
  const maintenanceSummary = microservices.filter(s => s.status === "maintenance").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Microservices Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time health status across {microservices.length} deployed services
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Healthy</p>
          <p className="text-2xl font-bold font-mono mt-1 text-[color:var(--success)]">{healthySummary}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Degraded / Down</p>
          <p className="text-2xl font-bold font-mono mt-1 text-[color:var(--warning)]">{degradedSummary}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Maintenance</p>
          <p className="text-2xl font-bold font-mono mt-1 text-muted-foreground">{maintenanceSummary}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Stack filter — pill toggles */}
        <div className="flex items-center gap-1 p-1 rounded-md border border-border/60 bg-muted/30">
          {STACK_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStackFilter(s)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-colors duration-100",
                stackFilter === s
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? "All Stacks" : s}
            </button>
          ))}
        </div>

        {/* Status filter — select */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} of {microservices.length} services
        </span>
      </div>

      {/* Service grid */}
      {displayed.length === 0 ? (
        <div className="linear-card flex items-center justify-center h-48" style={{ padding: "var(--card-padding)" }}>
          <div className="text-center space-y-1">
            <Server className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">No services match this filter.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} />
          ))}
        </div>
      )}
    </div>
  );
}
