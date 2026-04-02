"use client";

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AccountNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm animate-fade-up" style={{ borderTop: "var(--rule-strong)" }}>
        <div className="pt-6 pb-4" style={{ borderBottom: "var(--rule)" }}>
          <p className="label-caps mb-3">Error</p>
          <h1 className="font-display text-2xl text-foreground">Account Not Found</h1>
        </div>

        <div className="py-5" style={{ borderBottom: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We could not find your account in the system. This may be a temporary synchronization issue.
          </p>
          <ul className="space-y-2">
            {[
              "Wait a moment then refresh",
              "Sign out and sign back in",
              "Contact support if the issue persists",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-[5px] size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-5 flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <SignOutButton>
            <button className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
