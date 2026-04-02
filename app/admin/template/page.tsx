"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const DEFAULT_SUBJECTS = [
  "Subject 1",
  "Subject 2",
  "Subject 3",
  "Subject 4",
  "Subject 5",
  "Subject 6",
  "Subject 7",
];

const examStructure = [
  { label: "MST-I",              value: "25", note: "Mid-semester test 1" },
  { label: "MST-II",             value: "25", note: "Mid-semester test 2" },
  { label: "EST",                value: "50", note: "End-semester test"   },
  { label: "Total per Subject",  value: "100", note: "MST-I + MST-II + EST" },
];

export default function TemplatePage() {
  const template = useQuery(api.functions.queries.getActiveTemplate);
  const saveTemplate = useMutation(api.functions.adminMutations.saveTemplate);
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) setSubjects(template.subjects);
  }, [template]);

  const handleChange = (i: number, val: string) => {
    const updated = [...subjects];
    updated[i] = val;
    setSubjects(updated);
  };

  const handleSave = async () => {
    const empty = subjects.findIndex((s) => !s.trim());
    if (empty !== -1) return toast.error(`Subject ${empty + 1} cannot be empty`);
    try {
      setSaving(true);
      await saveTemplate({ subjects: subjects.map((s) => s.trim()) });
      toast.success("Template saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  if (template === undefined) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="animate-fade-up space-y-10">
      <div>
        <p className="label-caps mb-1">Admin</p>
        <h1 className="font-display text-2xl text-foreground">Marksheet Template</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the universal marksheet. Exactly 7 subjects apply to all students.
          {template && (
            <> Last updated: {new Date(template.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.</>
          )}
        </p>
      </div>

      {/* Exam structure — horizontal ruled strip */}
      <div>
        <p className="label-caps mb-3">Exam Structure</p>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "var(--rule-strong)", borderBottom: "var(--rule-strong)" }}
        >
          {examStructure.map((item, i) => (
            <div
              key={item.label}
              className="py-5 px-0 md:px-6 first:pl-0"
              style={{ borderRight: i < examStructure.length - 1 ? "var(--rule)" : "none" }}
            >
              <p className="label-caps mb-1">{item.label}</p>
              <p className="font-display text-2xl text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject list */}
      <div className="max-w-lg">
        <p className="label-caps mb-4">Subject Names</p>
        <div style={{ borderTop: "var(--rule-strong)" }}>
          {subjects.map((subject, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3"
              style={{ borderBottom: "var(--rule)" }}
            >
              <span className="font-mono text-xs text-muted-foreground/50 w-6 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Input
                value={subject}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={`Subject ${i + 1}`}
                className="h-8 rounded-sm text-sm border-0 border-b border-border rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 h-9 px-6 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            {saving && <Spinner className="size-4" />}
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
