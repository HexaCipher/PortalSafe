"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Moon, Sun, Laptop, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const publicRoutes = ["/auth", "/pending", "/403", "/account-not-found"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const dbUser = useQuery(
    api.functions.queries.getUserByClerkId,
    user?.id ? { clerk_user_id: user.id } : "skip",
  );

  const isAdmin = dbUser?.role === "admin";
  const isStudent = dbUser?.role === "user" && dbUser?.status === "confirmed";

  const isPublicRoute = publicRoutes.some((r) => pathname?.startsWith(r));
  if (isPublicRoute) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    ...(isStudent ? [{ href: "/student", label: "Student Portal" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background" style={{ borderBottom: "var(--rule)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">

            {/* Brand wordmark */}
            <Link
              href="/"
              className="font-display text-lg tracking-tight text-foreground transition-opacity hover:opacity-70"
              style={{ fontStyle: "italic" }}
            >
              PortalSafe
            </Link>

            {/* Desktop nav — text links with animated underline */}
            <nav className="hidden md:flex items-center gap-8">
              {isSignedIn && navLinks.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm font-medium transition-colors group"
                    style={{ color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
                  >
                    {link.label}
                    {/* Underline slide — the differentiating motion */}
                    <span
                      className="absolute -bottom-[1px] left-0 h-px bg-foreground transition-transform duration-200 origin-left"
                      style={{
                        width: "100%",
                        transform: active ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                    <span
                      className="absolute -bottom-[1px] left-0 h-px bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                      style={{ width: "100%", display: active ? "none" : "block" }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    aria-label="Toggle theme"
                  >
                    <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 rounded-sm font-sans text-sm"
                  style={{ border: "var(--rule-strong)" }}
                >
                  <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 rounded-none">
                    <Sun className="size-3.5" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 rounded-none">
                    <Moon className="size-3.5" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 rounded-none">
                    <Laptop className="size-3.5" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden sm:block h-4 w-px bg-border" />

              {/* Auth */}
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-7 rounded-sm",
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/auth"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth"
                    className="inline-flex h-8 items-center px-4 text-sm font-medium text-primary-foreground bg-primary transition-opacity hover:opacity-90"
                    style={{ borderRadius: "2px" }}
                  >
                    Sign up
                  </Link>
                </div>
              </SignedOut>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — dropdown ruled list */}
        {mobileOpen && (
          <div className="md:hidden bg-background" style={{ borderTop: "var(--rule)" }}>
            <div className="mx-auto max-w-7xl px-6">
              {isSignedIn && navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-12 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  style={{ borderBottom: "var(--rule)" }}
                >
                  {link.label}
                </Link>
              ))}
              <SignedOut>
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-12 text-sm font-medium text-foreground transition-colors"
                  style={{ borderBottom: "var(--rule)" }}
                >
                  Sign in / Sign up
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
