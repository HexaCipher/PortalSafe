"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm animate-fade-up" style={{ borderTop: "var(--rule-strong)" }}>
        <div className="pt-6 pb-4" style={{ borderBottom: "var(--rule)" }}>
          <p className="label-caps mb-3">Account Status</p>
          <h1 className="font-display text-2xl text-foreground">
            Pending Approval
          </h1>
        </div>

        <div className="py-5" style={{ borderBottom: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account has been created successfully. An administrator must review
            and confirm your account before you can access the application.
          </p>
        </div>

        <div className="py-5" style={{ borderBottom: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please check back later. Contact support if you have any questions.
          </p>
        </div>

        <div className="pt-5">
          <SignOutButton>
            <button
              className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
