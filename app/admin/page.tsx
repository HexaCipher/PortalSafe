"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function AdminOverviewPage() {
  const stats = useQuery(api.functions.queries.getAdminStats);

  if (!stats) {
    return (
      <div className="animate-fade-in">
        <div className="h-8 w-32 bg-muted rounded-sm animate-pulse mb-10" />
        <div className="grid grid-cols-4 gap-0" style={{ borderTop: "var(--rule-strong)", borderBottom: "var(--rule-strong)" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="py-6 px-6" style={{ borderRight: i < 3 ? "var(--rule)" : "none" }}>
              <div className="h-3 w-16 bg-muted rounded-sm animate-pulse mb-3" />
              <div className="h-7 w-10 bg-muted rounded-sm animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Total Users",    value: stats.totalUsers },
    { label: "Pending",        value: stats.pendingUsers },
    { label: "Confirmed",      value: stats.confirmedUsers },
    { label: "Admins",         value: stats.adminUsers },
  ];

  const quickLinks = [
    { href: "/admin/users",    label: "Manage Users",        desc: "Approve, disable, or delete user accounts" },
    { href: "/admin/marks",    label: "Marks Entry",         desc: "Enter or update student examination marks" },
    { href: "/admin/notices",  label: "Post Notice",         desc: "Publish announcements to students" },
    { href: "/admin/students", label: "Student Profiles",    desc: "View and edit registered student details" },
  ];

  return (
    <div className="animate-fade-up space-y-12">

      {/* Page heading */}
      <div>
        <p className="label-caps mb-1">Overview</p>
        <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
      </div>

      {/* ── Stats strip ───────────────────────────────────── */}
      <div>
        <p className="label-caps mb-3">User Statistics</p>
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: "var(--rule-strong)", borderBottom: "var(--rule-strong)" }}
        >
          {statItems.map((stat, i) => (
            <div
              key={stat.label}
              className="py-6 px-0 lg:px-6 first:pl-0"
              style={{
                borderRight: i < statItems.length - 1 ? "var(--rule)" : "none",
                borderBottom: i < 2 ? "var(--rule)" : "none",
              }}
            >
              <p className="label-caps mb-2">{stat.label}</p>
              <p className="font-display text-3xl text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-col below: recent actions + quick links ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-12">

        {/* Recent admin actions */}
        <div>
          <p className="label-caps mb-4">Recent Actions</p>
          <div style={{ borderTop: "var(--rule-strong)" }}>
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_1fr_8rem] gap-4 py-2 bg-muted/40"
              style={{ borderBottom: "var(--rule-strong)" }}
            >
              {["Action", "Target", "Time"].map((h) => (
                <span key={h} className="label-caps px-1">{h}</span>
              ))}
            </div>

            {stats.recentActions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">No recent actions recorded.</p>
            ) : (
              stats.recentActions.map((action) => (
                <div
                  key={action._id}
                  className="grid grid-cols-[1fr_1fr_8rem] gap-4 py-3.5 px-1"
                  style={{ borderBottom: "var(--rule)" }}
                >
                  <span className="text-sm font-medium text-foreground font-mono">
                    {action.action_type}
                  </span>
                  <span className="text-xs text-muted-foreground truncate self-center">
                    {action.target_clerk_user_id.slice(0, 20)}…
                  </span>
                  <span className="text-xs text-muted-foreground self-center">
                    {new Date(action.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="label-caps mb-4">Quick Access</p>
          <div style={{ borderTop: "var(--rule-strong)" }}>
            {quickLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start justify-between py-4 gap-4 transition-colors hover:bg-muted/30"
                style={{ borderBottom: "var(--rule)", paddingLeft: "0.25rem", paddingRight: "0.25rem" }}
              >
                <div>
                  <p className="text-sm font-medium text-foreground mb-0.5">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Additional stats */}
      <div className="flex items-center gap-8 pt-2" style={{ borderTop: "var(--rule)" }}>
        <div>
          <p className="label-caps mb-1">Active Notices</p>
          <p className="text-xl font-display text-foreground">{stats.activeNotices}</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="label-caps mb-1">Student Profiles</p>
          <p className="text-xl font-display text-foreground">{stats.totalProfiles}</p>
        </div>
      </div>

    </div>
  );
}
