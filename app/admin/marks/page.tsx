"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface MarkRow {
  subject_name: string;
  mst1: string;
  mst2: string;
  est: string;
}

function getGrade(total: number): string {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "F";
}

const gradeColors: Record<string, string> = {
  "A+": "var(--color-primary)",
  "A":  "var(--color-primary)",
  "B+": "oklch(0.55 0.14 200)",
  "B":  "oklch(0.55 0.14 200)",
  "C":  "oklch(0.60 0.14 80)",
  "D":  "oklch(0.70 0.12 60)",
  "F":  "var(--color-destructive)",
};

export default function MarksEntryPage() {
  const router = useRouter();
  const template = useQuery(api.functions.queries.getActiveTemplate);
  const students = useQuery(api.functions.queries.getConfirmedStudents);
  const saveMarksMutation = useMutation(api.functions.adminMutations.saveMarks);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [markRows, setMarkRows] = useState<MarkRow[]>([]);
  const [saving, setSaving] = useState(false);

  const existingMarks = useQuery(
    api.functions.queries.getMarksByStudentSemester,
    selectedStudent && selectedSemester
      ? { student_clerk_id: selectedStudent, semester: parseInt(selectedSemester) }
      : "skip"
  );

  useEffect(() => {
    if (template) {
      setMarkRows(template.subjects.map((name) => ({ subject_name: name, mst1: "", mst2: "", est: "" })));
    }
  }, [template]);

  useEffect(() => {
    if (existingMarks && existingMarks.length > 0 && template) {
      setMarkRows(
        template.subjects.map((name) => {
          const ex = existingMarks.find((m) => m.subject_name === name);
          return { subject_name: name, mst1: ex ? String(ex.mst1) : "", mst2: ex ? String(ex.mst2) : "", est: ex ? String(ex.est) : "" };
        })
      );
    } else if (template && existingMarks && existingMarks.length === 0) {
      setMarkRows(template.subjects.map((name) => ({ subject_name: name, mst1: "", mst2: "", est: "" })));
    }
  }, [existingMarks, template]);

  const handleChange = (i: number, field: "mst1" | "mst2" | "est", val: string) => {
    const updated = [...markRows];
    updated[i] = { ...updated[i], [field]: val };
    setMarkRows(updated);
  };

  const getTotal = (row: MarkRow) =>
    (parseInt(row.mst1) || 0) + (parseInt(row.mst2) || 0) + (parseInt(row.est) || 0);

  const handleSubmit = async () => {
    if (!selectedStudent) return toast.error("Please select a student");
    if (!selectedSemester) return toast.error("Please select a semester");

    for (const row of markRows) {
      const m1 = parseInt(row.mst1), m2 = parseInt(row.mst2), e = parseInt(row.est);
      if (row.mst1 === "" || row.mst2 === "" || row.est === "") return toast.error(`All marks required for ${row.subject_name}`);
      if (isNaN(m1) || m1 < 0 || m1 > 25) return toast.error(`MST-I for ${row.subject_name} must be 0–25`);
      if (isNaN(m2) || m2 < 0 || m2 > 25) return toast.error(`MST-II for ${row.subject_name} must be 0–25`);
      if (isNaN(e) || e < 0 || e > 50) return toast.error(`EST for ${row.subject_name} must be 0–50`);
    }

    try {
      setSaving(true);
      await saveMarksMutation({
        student_clerk_id: selectedStudent,
        semester: parseInt(selectedSemester),
        marks: markRows.map((r) => ({ subject_name: r.subject_name, mst1: parseInt(r.mst1), mst2: parseInt(r.mst2), est: parseInt(r.est) })),
      });
      toast.success("Marks saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  if (template === undefined || students === undefined) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (!template) {
    return (
      <div className="animate-fade-up space-y-6">
        <div>
          <p className="label-caps mb-1">Marks Entry</p>
          <h1 className="font-display text-2xl text-foreground">No Template Found</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A marksheet template must be created before entering marks.{" "}
          <button
            onClick={() => router.push("/admin/template")}
            className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Create template →
          </button>
        </p>
      </div>
    );
  }

  const overallTotal = markRows.reduce((s, r) => s + getTotal(r), 0);
  const overallMax = markRows.length * 100;
  const overallPct = overallMax > 0 ? Math.round((overallTotal / overallMax) * 100) : 0;

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <p className="label-caps mb-1">Admin</p>
        <h1 className="font-display text-2xl text-foreground">Marks Entry</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a student and semester, then enter marks for all subjects.</p>
      </div>

      {/* Selector row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: "var(--rule-strong)", paddingTop: "1.5rem" }}>
        <div>
          <p className="label-caps mb-2">Student</p>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="rounded-sm h-9 text-sm border-border">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {students?.map((s) => (
                <SelectItem key={s.clerk_user_id} value={s.clerk_user_id} className="text-sm">
                  {s.name} — {s.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="label-caps mb-2">Semester</p>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="rounded-sm h-9 text-sm border-border">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={String(sem)} className="text-sm">Semester {sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marksheet table */}
      {selectedStudent && selectedSemester && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-caps">Semester {selectedSemester} — Marksheet</p>
              {existingMarks && existingMarks.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">Editing existing marks — changes will overwrite previous entries.</p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto" style={{ borderTop: "var(--rule-strong)" }}>
            {/* Header */}
            <div
              className="grid gap-2 px-2 py-2 bg-muted/40"
              style={{
                gridTemplateColumns: "1fr 6rem 6rem 6rem 5rem 4rem",
                borderBottom: "var(--rule-strong)",
              }}
            >
              {["Subject", "MST-I (25)", "MST-II (25)", "EST (50)", "Total", "Grade"].map((h) => (
                <span key={h} className="label-caps">{h}</span>
              ))}
            </div>

            {markRows.map((row, i) => {
              const total = getTotal(row);
              const grade = row.mst1 && row.mst2 && row.est ? getGrade(total) : "–";
              return (
                <div
                  key={i}
                  className="grid gap-2 px-2 py-2.5 items-center"
                  style={{
                    gridTemplateColumns: "1fr 6rem 6rem 6rem 5rem 4rem",
                    borderBottom: "var(--rule)",
                  }}
                >
                  <span className="text-sm font-medium text-foreground">{row.subject_name}</span>
                  <Input type="number" min="0" max="25" value={row.mst1} onChange={(e) => handleChange(i, "mst1", e.target.value)} className="h-8 text-center text-sm rounded-sm" placeholder="0" />
                  <Input type="number" min="0" max="25" value={row.mst2} onChange={(e) => handleChange(i, "mst2", e.target.value)} className="h-8 text-center text-sm rounded-sm" placeholder="0" />
                  <Input type="number" min="0" max="50" value={row.est} onChange={(e) => handleChange(i, "est", e.target.value)} className="h-8 text-center text-sm rounded-sm" placeholder="0" />
                  <span className="text-sm font-semibold text-foreground text-center">{row.mst1 && row.mst2 && row.est ? total : "–"}</span>
                  <span className="text-sm font-bold text-center" style={{ color: gradeColors[grade] ?? "inherit" }}>{grade}</span>
                </div>
              );
            })}

            {/* Summary row */}
            <div
              className="grid gap-2 px-2 py-3 bg-muted/40 items-center"
              style={{ gridTemplateColumns: "1fr 6rem 6rem 6rem 5rem 4rem", borderTop: "var(--rule-strong)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Overall</span>
              <span /><span /><span />
              <span className="text-sm font-bold text-foreground text-center">
                {overallTotal} / {overallMax}
              </span>
              <span className="text-sm font-bold text-center" style={{ color: gradeColors[getGrade(overallPct)] }}>
                {overallTotal > 0 ? `${overallPct}%` : "–"}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 h-9 px-6 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {saving && <Spinner className="size-4" />}
              Save Marks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
