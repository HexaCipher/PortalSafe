"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const gradeColors: Record<string, string> = {
  "A+": "var(--color-primary)",
  "A":  "var(--color-primary)",
  "B+": "oklch(0.55 0.14 200)",
  "B":  "oklch(0.55 0.14 200)",
  "C":  "oklch(0.60 0.14 80)",
  "D":  "oklch(0.70 0.12 60)",
  "F":  "var(--color-destructive)",
};

export default function StudentMarksPage() {
  const [semester, setSemester] = useState(1);
  const profile = useQuery(api.functions.queries.getMyProfile);
  const marks = useQuery(api.functions.queries.getMyMarks, { semester });

  if (profile === undefined) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner /></div>;
  }

  if (profile === null) {
    return (
      <div className="animate-fade-up">
        <p className="label-caps mb-2">My Marks</p>
        <p className="text-sm text-muted-foreground">
          You need to create your student profile before marks are available.
        </p>
      </div>
    );
  }

  const totalMarks = marks?.reduce((s, m) => s + m.total, 0) ?? 0;
  const maxMarks = (marks?.length ?? 0) * 100;
  const overallPct = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(1) : "0.0";

  return (
    <div className="animate-fade-up space-y-8">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="label-caps mb-1">Student</p>
          <h1 className="font-display text-2xl text-foreground">My Marks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.full_name} · {profile.department} · Roll {profile.roll_number}
          </p>
        </div>
        <div>
          <p className="label-caps mb-2">Semester</p>
          <Select value={String(semester)} onValueChange={(v) => setSemester(Number(v))}>
            <SelectTrigger className="w-40 h-9 rounded-sm text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {[1,2,3,4,5,6,7,8].map((s) => (
                <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary strip */}
      {marks && marks.length > 0 && (
        <div
          className="grid grid-cols-3"
          style={{ borderTop: "var(--rule-strong)", borderBottom: "var(--rule-strong)" }}
        >
          {[
            { label: "Subjects",    value: String(marks.length) },
            { label: "Total Marks", value: `${totalMarks} / ${maxMarks}` },
            { label: "Percentage",  value: `${overallPct}%` },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="py-5 px-0 md:px-6 first:pl-0"
              style={{ borderRight: i < 2 ? "var(--rule)" : "none" }}
            >
              <p className="label-caps mb-1">{stat.label}</p>
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Marksheet table */}
      {marks === undefined ? (
        <div className="flex justify-center h-32 items-center"><Spinner /></div>
      ) : marks.length === 0 ? (
        <div style={{ borderTop: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground py-10">
            No marks have been entered for Semester {semester} yet.
          </p>
        </div>
      ) : (
        <div>
          <p className="label-caps mb-4">Semester {semester} — Academic Record</p>
          <div className="overflow-x-auto" style={{ borderTop: "var(--rule-strong)" }}>
            {/* Header */}
            <div
              className="grid gap-3 py-2 px-1 bg-muted/40 min-w-[44rem]"
              style={{
                gridTemplateColumns: "2rem 1fr 5rem 5rem 5rem 5rem 5rem 4rem",
                borderBottom: "var(--rule-strong)",
              }}
            >
              {["#", "Subject", "MST-I", "MST-II", "EST", "Total", "%", "Grade"].map((h) => (
                <span key={h} className="label-caps">{h}</span>
              ))}
            </div>

            {marks.map((m, i) => (
              <div
                key={m._id}
                className="grid gap-3 py-3.5 px-1 items-center min-w-[44rem]"
                style={{
                  gridTemplateColumns: "2rem 1fr 5rem 5rem 5rem 5rem 5rem 4rem",
                  borderBottom: "var(--rule)",
                }}
              >
                <span className="text-xs text-muted-foreground/50 font-mono">{i + 1}</span>
                <span className="text-sm font-medium text-foreground">{m.subject_name}</span>
                <span className="text-sm text-center text-foreground">{m.mst1}</span>
                <span className="text-sm text-center text-foreground">{m.mst2}</span>
                <span className="text-sm text-center text-foreground">{m.est}</span>
                <span className="text-sm text-center font-semibold text-foreground">{m.total}</span>
                <span className="text-sm text-center text-muted-foreground">{m.percentage.toFixed(1)}%</span>
                <span
                  className="text-sm font-bold text-center"
                  style={{ color: gradeColors[m.grade] ?? "inherit" }}
                >
                  {m.grade}
                </span>
              </div>
            ))}

            {/* Summary row */}
            <div
              className="grid gap-3 py-3.5 px-1 bg-muted/40 min-w-[44rem] items-center"
              style={{
                gridTemplateColumns: "2rem 1fr 5rem 5rem 5rem 5rem 5rem 4rem",
                borderTop: "var(--rule-strong)",
              }}
            >
              <span />
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Overall</span>
              <span className="text-sm text-center font-mono">{marks.reduce((s, m) => s + m.mst1, 0)}</span>
              <span className="text-sm text-center font-mono">{marks.reduce((s, m) => s + m.mst2, 0)}</span>
              <span className="text-sm text-center font-mono">{marks.reduce((s, m) => s + m.est, 0)}</span>
              <span className="text-sm text-center font-bold text-foreground">{totalMarks}</span>
              <span className="text-sm text-center font-bold" style={{ color: gradeColors[marks[0]?.grade] }}>{overallPct}%</span>
              <span />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
