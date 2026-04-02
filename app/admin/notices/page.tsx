"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const priorityLabel: Record<string, { label: string; color: string }> = {
  high:   { label: "High",   color: "var(--color-destructive)" },
  medium: { label: "Medium", color: "oklch(0.70 0.14 80)"      },
  low:    { label: "Low",    color: "oklch(0.55 0.14 200)"     },
};

export default function NoticesPage() {
  const notices = useQuery(api.functions.queries.getAllNotices);
  const createNotice = useMutation(api.functions.adminMutations.createNotice);
  const deleteNotice = useMutation(api.functions.adminMutations.deleteNotice);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState("all");

  const resetForm = () => { setTitle(""); setDescription(""); setPriority("medium"); setTargetAudience("all"); };

  const handleCreate = async () => {
    if (title.length < 3) return toast.error("Title must be at least 3 characters");
    if (description.length < 10) return toast.error("Description must be at least 10 characters");
    try {
      setSaving(true);
      await createNotice({ title, description, priority, target_audience: targetAudience });
      toast.success("Notice published");
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish notice");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"notices">) => {
    try {
      setDeletingId(id);
      await deleteNotice({ notice_id: id });
      toast.success("Notice removed");
    } catch {
      toast.error("Failed to remove notice");
    } finally {
      setDeletingId(null);
    }
  };

  if (notices === undefined) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  const active = notices.filter((n) => n.is_active);
  const archived = notices.filter((n) => !n.is_active);

  return (
    <div className="animate-fade-up space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps mb-1">Admin</p>
          <h1 className="font-display text-2xl text-foreground">Notices</h1>
          <p className="text-sm text-muted-foreground mt-1">Publish and manage announcements visible to students.</p>
        </div>

        {/* Create dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="inline-flex items-center gap-2 h-9 px-5 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90"
              style={{ borderRadius: "2px" }}
            >
              <Plus className="size-4" /> New Notice
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-sm" style={{ border: "var(--rule-strong)" }}>
            <DialogHeader>
              <DialogTitle className="font-display text-lg">New Notice</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              <div>
                <p className="label-caps mb-2">Title</p>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" className="rounded-sm h-9 text-sm" />
              </div>
              <div>
                <p className="label-caps mb-2">Description</p>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write the notice description..." rows={4} className="rounded-sm text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="label-caps mb-2">Priority</p>
                  <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                    <SelectTrigger className="rounded-sm h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-sm">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="label-caps mb-2">Audience</p>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="rounded-sm h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-sm">
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      {[1,2,3,4,5,6,7,8].map((s) => <SelectItem key={s} value={`Semester ${s}`}>Semester {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="inline-flex items-center gap-2 h-9 px-6 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  {saving && <Spinner className="size-4" />}
                  Publish
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notice list */}
      {notices.length === 0 ? (
        <div style={{ borderTop: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground py-10">No notices published yet.</p>
        </div>
      ) : (
        <div>
          <p className="label-caps mb-3">Active ({active.length})</p>
          <div style={{ borderTop: "var(--rule-strong)" }}>
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">No active notices.</p>
            ) : (
              active.map((notice) => {
                const p = priorityLabel[notice.priority];
                return (
                  <div
                    key={notice._id}
                    className={`flex items-start gap-4 py-4 pl-4 pr-3 transition-colors hover:bg-muted/30 priority-${notice.priority}`}
                    style={{ borderBottom: "var(--rule)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold text-foreground">{notice.title}</p>
                        <span className="text-xs font-medium" style={{ color: p.color }}>{p.label}</span>
                        <span className="text-xs text-muted-foreground">→ {notice.target_audience}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{notice.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5">
                        {new Date(notice.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      disabled={deletingId === notice._id}
                      className="shrink-0 flex size-7 items-center justify-center text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                      title="Remove notice"
                    >
                      {deletingId === notice._id ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {archived.length > 0 && (
            <div className="mt-8">
              <p className="label-caps mb-3">Archived ({archived.length})</p>
              <div style={{ borderTop: "var(--rule)" }}>
                {archived.map((notice) => (
                  <div key={notice._id} className="py-4 px-1 opacity-40" style={{ borderBottom: "var(--rule)" }}>
                    <p className="text-sm font-medium text-foreground line-through">{notice.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Removed · {new Date(notice.published_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
