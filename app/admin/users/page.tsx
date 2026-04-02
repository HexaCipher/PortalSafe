"use client";

import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <p className="label-caps mb-1">Admin</p>
        <h1 className="font-display text-2xl text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve pending accounts, review user roles, and manage access.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
