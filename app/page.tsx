"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Lock,
  Globe,
  FileCheck2,
  Users,
  Activity,
  KeyRound,
  ScanEye,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

/* ── Shared animation variant ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Data ───────────────────────────────────────────────── */
const specs = [
  { label: "Security Layers", value: "4" },
  { label: "Validation", value: "Dual (Client + Server)" },
  { label: "Auth Method", value: "Clerk / HTTPS + JWT" },
  { label: "Role System", value: "RBAC — Admin / Student" },
  { label: "Audit Logging", value: "Full action trail" },
];

const depthLayers = [
  {
    num: "01",
    label: "Clerk Authentication",
    icon: KeyRound,
    description: "Identity over HTTPS via OAuth or Email/Password. JWT issued and validated per request.",
  },
  {
    num: "02",
    label: "Session Wrapper",
    icon: ScanEye,
    description: "Client gate: unauthenticated sessions redirect to /auth before rendering any page.",
  },
  {
    num: "03",
    label: "Role Wrappers",
    icon: ShieldCheck,
    description: "AdminWrapper and StudentWrapper enforce role + account status. Pending accounts go to /pending.",
  },
  {
    num: "04",
    label: "Backend Guards",
    icon: Lock,
    description: "requireAdmin() verified against Convex DB on every mutation — impossible to spoof from client.",
  },
  {
    num: "05",
    label: "Audit Logging",
    icon: Activity,
    description: "Every privileged action recorded with actor, target, timestamp, and action type.",
  },
];

const features = [
  {
    icon: Lock,
    title: "Access Control & Least Privilege",
    points: [
      "SessionWrapper redirects unauthenticated users",
      "AdminWrapper & StudentWrapper enforce role checks",
      "ConfirmedUserWrapper blocks pending/disabled accounts",
      "Fail-secure: default DENY, never ALLOW",
    ],
  },
  {
    icon: Globe,
    title: "HTTPS & Secure Communication",
    points: [
      "Clerk auth over HTTPS with secure JWT tokens",
      "Svix HMAC signature verification on webhooks",
      "Convex JWT issuer domain validation",
      "MITM protection for credentials & sessions",
    ],
  },
  {
    icon: FileCheck2,
    title: "Input Validation & Sensitive Data",
    points: [
      "Zod schemas: regex, length, type validation (client)",
      "Convex v validators & manual bounds (server)",
      "Roll number uniqueness enforced server-side",
      "Password hashing delegated to Clerk",
    ],
  },
  {
    icon: Users,
    title: "Machine Authorization (RBAC)",
    points: [
      "requireAdmin() guard on every admin mutation",
      "ctx.auth.getUserIdentity() for server-side auth",
      "Scoped queries: students only see own data",
      "Role-filtered navigation in Navbar",
    ],
  },
];

const auditRows = [
  { time: "2m ago",  action: "confirm_user",   target: "user_2abc...", by: "admin_1xyz" },
  { time: "5m ago",  action: "save_marks",      target: "230101 / Sem 3", by: "admin_1xyz" },
  { time: "12m ago", action: "create_notice",   target: "\"Exam Schedule\"", by: "admin_1xyz" },
  { time: "1h ago",  action: "delete_user",     target: "user_3def...", by: "admin_1xyz" },
];

/* ── Page ───────────────────────────────────────────────── */
export default function Homepage() {
  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 lg:pt-32 lg:pb-32 px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full max-w-5xl flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="label-caps mb-8"
          >
            IT Security Assignment — Experiment 2
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-foreground leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)" }}
          >
            Security-First
            <br />
            <span style={{ fontStyle: "italic", color: "var(--color-primary)" }}>
              Student Management
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            A full-stack application demonstrating{" "}
            <strong className="text-foreground font-medium">Access Control</strong>,{" "}
            <strong className="text-foreground font-medium">HTTPS</strong>,{" "}
            <strong className="text-foreground font-medium">Input Validation</strong>, and{" "}
            <strong className="text-foreground font-medium">Machine Authorization</strong>{" "}
            — built with layered defense-in-depth security principles.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 lg:mb-32">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 h-11 px-8 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 min-w-[160px]"
              style={{ borderRadius: "2px" }}
            >
              Get Started <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground underline underline-offset-4"
            >
              View features
            </Link>
          </motion.div>
        </motion.div>

        {/* Horizontal Spec Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto"
        >
          <p className="label-caps mb-4 text-center lg:text-left">System Specification</p>
          <div className="flex flex-col lg:flex-row" style={{ borderTop: "var(--rule-strong)", borderBottom: "var(--rule-strong)" }}>
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex flex-col justify-center px-4 py-4 lg:px-6 lg:py-6 flex-1 ${i < specs.length - 1 ? "border-b lg:border-b-0 lg:border-r" : ""}`}
                style={{ borderColor: "var(--rule)" }}
              >
                <span className="text-xs text-muted-foreground mb-1 label-caps">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── DEFENSE IN DEPTH ──────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} custom={0} className="label-caps mb-4">
              Core Principle
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-foreground mb-3"
              style={{ fontSize: "var(--text-display-sm)" }}
            >
              Defense in Depth
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mb-14 text-base">
              Multiple overlapping security layers ensure that if one fails, the next catches it.
            </motion.p>

            {/* Ledger table */}
            <div style={{ borderTop: "var(--rule-strong)" }}>
              {depthLayers.map((layer, i) => {
                const Icon = layer.icon;
                return (
                  <motion.div
                    key={layer.num}
                    variants={fadeUp}
                    custom={i + 3}
                    className="grid grid-cols-[3rem_1fr_1fr] lg:grid-cols-[3rem_14rem_1fr] items-start gap-6 py-5"
                    style={{ borderBottom: "var(--rule)" }}
                  >
                    {/* Number */}
                    <span className="font-mono text-xs text-muted-foreground/50 pt-0.5">
                      {layer.num}
                    </span>

                    {/* Label */}
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold text-foreground">{layer.label}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {layer.description}
                    </p>
                  </motion.div>
                );
              })}

              {/* Fail-secure note */}
              <motion.div
                variants={fadeUp}
                custom={depthLayers.length + 3}
                className="flex items-start gap-4 py-5 bg-muted/40"
                style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
              >
                <ShieldCheck className="size-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-foreground">Fail-Secure Principle — </span>
                  <span className="text-sm text-muted-foreground">
                    If any layer fails or a component throws, the system defaults to{" "}
                    <strong className="text-foreground">DENY</strong>. Users are redirected to{" "}
                    <code className="text-xs font-mono bg-muted px-1 py-0.5">/403</code> or{" "}
                    <code className="text-xs font-mono bg-muted px-1 py-0.5">/pending</code>.
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECURITY FEATURES ─────────────────────────────── */}
      <section id="features" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} custom={0} className="label-caps mb-4">
              Implementation Details
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-foreground mb-14"
              style={{ fontSize: "var(--text-display-sm)" }}
            >
              Security Features
            </motion.h2>

            {/* 2-col feature list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ borderTop: "var(--rule-strong)" }}>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeUp}
                    custom={i + 2}
                    className="py-8 pr-8"
                    style={{
                      borderBottom: "var(--rule)",
                      borderRight: i % 2 === 0 ? "var(--rule)" : "none",
                      paddingLeft: i % 2 === 1 ? "2rem" : "0",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex size-8 items-center justify-center rounded-sm bg-primary/10">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {feature.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-[5px] size-1.5 rounded-full bg-primary/60 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── AUDIT LOG ─────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} custom={0} className="label-caps mb-4">
              Accountability
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-foreground mb-3"
              style={{ fontSize: "var(--text-display-sm)" }}
            >
              Audit Logging
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mb-10 text-base">
              Every privileged operation is recorded in the{" "}
              <code className="text-xs font-mono bg-muted px-1.5 py-0.5">admin_actions</code> table
              — who did what, to whom, and when.
            </motion.p>

            {/* Terminal-style log table */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="overflow-x-auto"
              style={{ border: "var(--rule-strong)" }}
            >
              {/* Header row */}
              <div
                className="grid grid-cols-[6rem_1fr_1fr_8rem] gap-4 px-4 py-2 bg-muted/50"
                style={{ borderBottom: "var(--rule-strong)" }}
              >
                {["Time", "Action", "Target", "By"].map((h) => (
                  <span key={h} className="label-caps">{h}</span>
                ))}
              </div>

              {auditRows.map((row, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i + 4}
                  className="grid grid-cols-[6rem_1fr_1fr_8rem] gap-4 px-4 py-3 font-mono text-xs"
                  style={{ borderBottom: i < auditRows.length - 1 ? "var(--rule)" : "none" }}
                >
                  <span className="text-muted-foreground/60">{row.time}</span>
                  <span className="text-primary font-semibold">{row.action}</span>
                  <span className="text-foreground/80 truncate">{row.target}</span>
                  <span className="text-muted-foreground truncate">{row.by}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} custom={8} className="mt-4 text-xs text-muted-foreground">
              Logged fields:{" "}
              {["action_type", "target", "by_clerk_user_id", "details", "_creationTime"].map((f, i, arr) => (
                <span key={f}>
                  <code className="font-mono bg-muted px-1 py-0.5">{f}</code>
                  {i < arr.length - 1 && ", "}
                </span>
              ))}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── TECH STACK FOOTER ─────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="label-caps mr-4">Built with</span>
            {["Next.js 16", "Convex", "Clerk", "Tailwind CSS v4", "Framer Motion", "Zod", "shadcn/ui"].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-muted-foreground/60 hover:text-foreground transition-colors cursor-default"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

    </main>
  );
}