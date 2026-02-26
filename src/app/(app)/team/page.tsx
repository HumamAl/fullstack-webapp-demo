"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { teamMembers, sprintTasks } from "@/data/mock-data";
import type { TeamMember, SprintTask, TaskStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type Availability = TeamMember["availability"];

function AvailabilityDot({ availability }: { availability: Availability }) {
  const config: Record<Availability, { cls: string; pulse: boolean }> = {
    available: { cls: "bg-[color:var(--success)]",         pulse: false },
    busy:      { cls: "bg-[color:var(--warning)]",          pulse: true  },
    offline:   { cls: "bg-muted-foreground/50",             pulse: false },
  };
  const { cls, pulse } = config[availability];
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", cls)} />
      )}
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", cls)} />
    </span>
  );
}

function AvailabilityLabel({ availability }: { availability: Availability }) {
  const labels: Record<Availability, string> = {
    available: "Available",
    busy:      "Busy",
    offline:   "Offline",
  };
  const cls: Record<Availability, string> = {
    available: "text-[color:var(--success)]",
    busy:      "text-[color:var(--warning)]",
    offline:   "text-muted-foreground",
  };
  return <span className={cn("text-xs font-medium", cls[availability])}>{labels[availability]}</span>;
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; cls: string }> = {
    "backlog":     { label: "Backlog",     cls: "text-muted-foreground bg-muted border-0"                              },
    "in-progress": { label: "In Progress", cls: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-0"    },
    "in-review":   { label: "In Review",   cls: "text-blue-600 bg-blue-500/10 border-0"                                },
    "done":        { label: "Done",        cls: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-0"    },
    "blocked":     { label: "Blocked",     cls: "text-destructive bg-destructive/10 border-0"                           },
  };
  const { label, cls } = config[status];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium rounded-full px-2", cls)}>
      {label}
    </Badge>
  );
}

function PriorityDot({ priority }: { priority: SprintTask["priority"] }) {
  const cls: Record<SprintTask["priority"], string> = {
    critical: "bg-destructive",
    high:     "bg-[color:var(--warning)]",
    medium:   "bg-blue-500/60",
    low:      "bg-muted-foreground/40",
  };
  return <span className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-0.5", cls[priority])} />;
}

function MemberTaskList({ member }: { member: TeamMember }) {
  const tasks = useMemo(
    () => sprintTasks.filter((t) => t.assignee === member.name),
    [member.name]
  );

  if (tasks.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No tasks assigned.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-2">
          <PriorityDot priority={task.priority} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs leading-snug text-foreground/80 line-clamp-2">{task.title}</p>
              <TaskStatusBadge status={task.status} />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{task.id} · {task.storyPoints} pts</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const activeTasks = sprintTasks.filter(
    (t) => t.assignee === member.name && (t.status === "in-progress" || t.status === "in-review")
  ).length;

  return (
    <div className="linear-card flex flex-col gap-4" style={{ padding: "var(--card-padding)" }}>
      {/* Member header */}
      <div className="flex items-center gap-3">
        {/* Avatar circle */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-border/60 flex items-center justify-center">
            <span className="text-sm font-bold text-primary font-mono">{member.avatar}</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5">
            <AvailabilityDot availability={member.availability} />
          </span>
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{member.name}</p>
          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
        </div>

        <AvailabilityLabel availability={member.availability} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center border border-border/60 rounded-md p-2 bg-muted/20">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Done</p>
          <p className="font-mono font-bold text-sm text-[color:var(--success)]">{member.tasksCompleted}</p>
        </div>
        <div className="border-x border-border/40">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</p>
          <p className={cn("font-mono font-bold text-sm", activeTasks > 0 ? "text-[color:var(--warning)]" : "text-muted-foreground")}>{activeTasks}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">In Prog.</p>
          <p className="font-mono font-bold text-sm">{member.tasksInProgress}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/60" />

      {/* Assigned tasks */}
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-2">
          Assigned Tasks
        </p>
        <MemberTaskList member={member} />
      </div>
    </div>
  );
}

const AVAIL_OPTIONS: { value: string; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "available", label: "Available" },
  { value: "busy",      label: "Busy"      },
  { value: "offline",   label: "Offline"   },
];

export default function TeamPage() {
  const [availFilter, setAvailFilter] = useState<string>("all");

  const displayed = useMemo(
    () => teamMembers.filter((m) => availFilter === "all" || m.availability === availFilter),
    [availFilter]
  );

  const totalDone    = teamMembers.reduce((s, m) => s + m.tasksCompleted, 0);
  const totalActive  = teamMembers.reduce((s, m) => s + m.tasksInProgress, 0);
  const available    = teamMembers.filter((m) => m.availability === "available").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capacity and assigned sprint tasks across {teamMembers.length} engineers
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Tasks Completed</p>
          <p className="text-2xl font-bold font-mono mt-1 text-[color:var(--success)]">{totalDone}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">In Progress</p>
          <p className="text-2xl font-bold font-mono mt-1 text-[color:var(--warning)]">{totalActive}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Available</p>
          <p className="text-2xl font-bold font-mono mt-1">{available} / {teamMembers.length}</p>
        </div>
      </div>

      {/* Availability filter — pill toggles */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-md border border-border/60 bg-muted/30">
          {AVAIL_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setAvailFilter(o.value)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-colors duration-100",
                availFilter === o.value
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "engineer" : "engineers"}
        </span>
      </div>

      {/* Member grid */}
      {displayed.length === 0 ? (
        <div className="linear-card flex items-center justify-center h-48" style={{ padding: "var(--card-padding)" }}>
          <p className="text-sm text-muted-foreground">No engineers match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
