import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm animate-fade-up" style={{ borderTop: "var(--rule-strong)" }}>
        <div className="pt-6 pb-4" style={{ borderBottom: "var(--rule)" }}>
          <p className="label-caps mb-3">Error 403</p>
          <h1 className="font-display text-2xl text-foreground">Access Forbidden</h1>
        </div>

        <div className="py-5" style={{ borderBottom: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have permission to access this page. This area is restricted
            to authorized users with the required role.
          </p>
        </div>

        <div className="pt-5">
          <Link
            href="/"
            className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Return to home →
          </Link>
        </div>
      </div>
    </div>
  );
}
