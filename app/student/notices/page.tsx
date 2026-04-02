"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

const priorityConfig: Record<string, { label: string; color: string }> = {
  high:   { label: "High",   color: "var(--color-destructive)" },
  medium: { label: "Medium", color: "oklch(0.70 0.14 80)"      },
  low:    { label: "Low",    color: "oklch(0.55 0.14 200)"     },
};

export default function StudentNoticesPage() {
  const notices = useQuery(api.functions.queries.getMyNotices);

  if (notices === undefined) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner /></div>;
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <p className="label-caps mb-1">Student</p>
        <h1 className="font-display text-2xl text-foreground">Notices</h1>
        <p className="text-sm text-muted-foreground mt-1">Important announcements and updates from administration.</p>
      </div>

      {notices.length === 0 ? (
        <div style={{ borderTop: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground py-10">No notices have been published for you yet.</p>
        </div>
      ) : (
        <div style={{ borderTop: "var(--rule-strong)" }}>
          {notices.map((notice) => {
            const p = priorityConfig[notice.priority] ?? priorityConfig.low;
            return (
              <div
                key={notice._id}
                className={`py-5 pl-4 pr-2 transition-colors hover:bg-muted/30 priority-${notice.priority}`}
                style={{ borderBottom: "var(--rule)" }}
              >
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium" style={{ color: p.color }}>{p.label}</span>
                  <span className="text-xs text-muted-foreground/50">·</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notice.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {notice.target_audience !== "all" && (
                    <>
                      <span className="text-xs text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">{notice.target_audience}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <p className="text-sm font-semibold text-foreground mb-2">{notice.title}</p>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {notice.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
