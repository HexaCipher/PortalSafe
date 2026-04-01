"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AccountNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Account Not Found</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t find your account in our system. This might be a temporary issue.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm">
            Please try the following:
          </p>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>Wait a few moments and refresh the page</li>
            <li>Sign out and sign back in</li>
            <li>Contact support if the issue persists</li>
          </ul>
        </div>
        <div className="pt-4 flex gap-2">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
          <SignOutButton>
            <Button variant="default" className="flex-1 w-full">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </Card>
    </div>
  );
}

