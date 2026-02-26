"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { databaseQueries } from "@/data/mock-data";
import type { DatabaseQuery } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, Download } from "lucide-react";

type QueryStatus = DatabaseQuery["status"];
type DbType = DatabaseQuery["database"];
type SortKey = keyof Pick<DatabaseQuery, "name" | "avgExecutionTime" | "callsPerMinute" | "lastOptimized">;

function QueryStatusBadge({ status }: { status: QueryStatus }) {
  const config: Record<QueryStatus, { label: string; cls: string }> = {
    optimized: { label: "Optimized", cls: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
    slow:      { label: "Slow",      cls: "text-[color:var(--warning)] bg-[color:var(--warning)]/10"  },
    critical:  { label: "Critical",  cls: "text-destructive bg-destructive/10"                          },
  };
  const { label, cls } = config[status];
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border-0 rounded-full", cls)}>
      {label}
    </Badge>
  );
}

function DbBadge({ db }: { db: DbType }) {
  const isOracle = db === "oracle";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium border rounded-sm px-1.5 py-0 uppercase tracking-wide",
        isOracle
          ? "border-amber-500/30 text-amber-600 bg-amber-500/8"
          : "border-blue-500/30 text-blue-600 bg-blue-500/8"
      )}
    >
      {isOracle ? "Oracle" : "PostgreSQL"}
    </Badge>
  );
}

function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms}ms`;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all",       label: "All Statuses"    },
  { value: "optimized", label: "Optimized"        },
  { value: "needs",     label: "Needs Attention"  },
];

const DB_OPTIONS: { value: string; label: string }[] = [
  { value: "all",        label: "All Databases" },
  { value: "oracle",     label: "Oracle"        },
  { value: "postgresql", label: "PostgreSQL"    },
];

const COLUMNS: { key: SortKey | "database" | "table" | "status"; label: string; sortable: boolean }[] = [
  { key: "name",             label: "Query Name",        sortable: true  },
  { key: "database",         label: "Database",          sortable: false },
  { key: "avgExecutionTime", label: "Avg Exec Time",     sortable: true  },
  { key: "callsPerMinute",   label: "Calls / Min",       sortable: true  },
  { key: "table",            label: "Target Table",      sortable: false },
  { key: "status",           label: "Status",            sortable: false },
  { key: "lastOptimized",    label: "Last Optimized",    sortable: true  },
];

export default function DatabasePage() {
  const [dbFilter, setDbFilter]         = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey]           = useState<SortKey>("avgExecutionTime");
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded]         = useState<string | null>(null);

  const displayed = useMemo(() => {
    const filtered = databaseQueries.filter((q) => {
      const dbOk =
        dbFilter === "all" || q.database === dbFilter;
      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "optimized" && q.status === "optimized") ||
        (statusFilter === "needs"     && q.status !== "optimized");
      return dbOk && statusOk;
    });

    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
  }, [dbFilter, statusFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const totalCalls = databaseQueries.reduce((s, q) => s + q.callsPerMinute, 0);
  const slowCount  = databaseQueries.filter(q => q.status !== "optimized").length;
  const avgExec    = Math.round(databaseQueries.reduce((s, q) => s + q.avgExecutionTime, 0) / databaseQueries.length);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Database Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Query performance across Oracle and PostgreSQL databases
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export Report
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total Calls / Min</p>
          <p className="text-2xl font-bold font-mono mt-1">{totalCalls.toLocaleString()}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Needs Attention</p>
          <p className={cn("text-2xl font-bold font-mono mt-1", slowCount > 0 ? "text-[color:var(--warning)]" : "text-[color:var(--success)]")}>{slowCount}</p>
        </div>
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Avg Exec Time</p>
          <p className="text-2xl font-bold font-mono mt-1">{formatMs(avgExec)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={dbFilter} onValueChange={setDbFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Databases" />
          </SelectTrigger>
          <SelectContent>
            {DB_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "query" : "queries"}
        </span>
      </div>

      {/* Table */}
      <div className="linear-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide",
                      col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    )}
                    onClick={col.sortable ? () => handleSort(col.key as SortKey) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc"
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-sm text-muted-foreground">
                    No queries match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((q) => (
                  <>
                    <TableRow
                      key={q.id}
                      className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                      onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                    >
                      <TableCell className="font-medium text-sm max-w-[220px]">
                        <span className="truncate block">{q.name}</span>
                      </TableCell>
                      <TableCell><DbBadge db={q.database} /></TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-mono text-sm tabular-nums",
                          q.avgExecutionTime > 1000 ? "text-destructive" :
                          q.avgExecutionTime > 200  ? "text-[color:var(--warning)]" :
                          "text-foreground"
                        )}>
                          {formatMs(q.avgExecutionTime)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums text-right">
                        {q.callsPerMinute.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[160px]">
                        <span className="truncate block">{q.table}</span>
                      </TableCell>
                      <TableCell><QueryStatusBadge status={q.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{q.lastOptimized}</TableCell>
                    </TableRow>
                    {expanded === q.id && (
                      <TableRow key={`${q.id}-expanded`}>
                        <TableCell colSpan={COLUMNS.length} className="bg-muted/30 p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Database</p>
                              <DbBadge db={q.database} />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Target Table(s)</p>
                              <p className="font-mono text-xs">{q.table}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Calls / Min</p>
                              <p className="font-mono font-semibold">{q.callsPerMinute.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Last Optimized</p>
                              <p className="font-mono text-xs">{q.lastOptimized}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
