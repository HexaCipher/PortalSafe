"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type User = {
  _id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  status: "pending" | "confirmed" | "disabled";
  created_at: number;
  confirmed_at?: number;
};

const STATUS_FILTERS = ["all", "pending", "confirmed", "disabled"] as const;

const statusStyle: Record<string, { color: string; label: string }> = {
  confirmed: { color: "var(--color-primary)",              label: "Confirmed" },
  pending:   { color: "oklch(0.70 0.14 80)",               label: "Pending"   },
  disabled:  { color: "var(--color-destructive)",          label: "Disabled"  },
};

export function UserTable() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const data = useQuery(api.functions.queries.listUsers, {
    page: 0,
    page_size: 100,
    status_filter: statusFilter,
  });

  const confirmUser = useMutation(api.functions.adminMutations.confirmUser);
  const deleteUser = useAction(api.functions.adminMutations.deleteUser);

  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [confirmingUserId, setConfirmingUserId] = useState<string | null>(null);

  const handleConfirmUser = async (clerkUserId: string) => {
    try {
      setConfirmingUserId(clerkUserId);
      await confirmUser({ target_clerk_user_id: clerkUserId });
      toast.success("User confirmed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to confirm user");
    } finally {
      setConfirmingUserId(null);
    }
  };

  const handleDeleteUser = async (clerkUserId: string) => {
    try {
      setDeletingUserId(clerkUserId);
      await deleteUser({ target_clerk_user_id: clerkUserId });
      toast.success("User deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (!data) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  const users = data.users as User[];

  return (
    <div className="space-y-5">
      {/* Filter pills → text links */}
      <div className="flex items-center gap-5">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f;
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="relative text-sm font-medium transition-colors group capitalize"
              style={{ color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
            >
              {f}
              <span
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-foreground transition-transform origin-left duration-200"
                style={{ transform: active ? "scaleX(1)" : "scaleX(0)" }}
              />
            </button>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">
          {users.length} / {data.total} shown
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ borderTop: "var(--rule-strong)" }}>
        {/* Header */}
        <div
          className="grid gap-4 py-2 px-1 bg-muted/40 min-w-[48rem]"
          style={{
            gridTemplateColumns: "1fr 1fr 5rem 6rem 6rem 10rem",
            borderBottom: "var(--rule-strong)",
          }}
        >
          {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
            <span key={h} className="label-caps">{h}</span>
          ))}
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 px-1">No users match the current filter.</p>
        ) : (
          users.map((user) => {
            const ss = statusStyle[user.status] ?? statusStyle.pending;
            return (
              <div
                key={user._id}
                className="grid gap-4 py-3.5 px-1 items-center min-w-[48rem] hover:bg-muted/20 transition-colors"
                style={{
                  gridTemplateColumns: "1fr 1fr 5rem 6rem 6rem 10rem",
                  borderBottom: "var(--rule)",
                }}
              >
                <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                <span className="text-xs font-mono text-muted-foreground capitalize">{user.role}</span>
                <span className="text-xs font-medium" style={{ color: ss.color }}>{ss.label}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {user.status === "pending" && (
                    <button
                      onClick={() => handleConfirmUser(user.clerk_user_id)}
                      disabled={confirmingUserId === user.clerk_user_id}
                      className="inline-flex items-center gap-1.5 h-7 px-3 text-xs font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ borderRadius: "2px" }}
                    >
                      {confirmingUserId === user.clerk_user_id && <Spinner className="size-3" />}
                      Confirm
                    </button>
                  )}
                  <DeleteConfirmDialog
                    userName={user.name}
                    userEmail={user.email}
                    onConfirm={() => handleDeleteUser(user.clerk_user_id)}
                    isDeleting={deletingUserId === user.clerk_user_id}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
