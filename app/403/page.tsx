import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">403 - Access Forbidden</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm">
            This area is restricted to administrators only. If you believe you
            should have access, please contact your administrator.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/">
            <Button variant="default" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
