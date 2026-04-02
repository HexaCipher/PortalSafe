import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/lib/ConvexClerkProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { SessionWrapper } from "@/components/wrappers/SessionWrapper";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortalSafe — Secure Student Management",
  description:
    "A security-first student management system demonstrating Access Control, HTTPS, Input Validation, and Machine Authorization (RBAC).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${dmSerifDisplay.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <SessionWrapper>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                {children}
              </ThemeProvider>
            </SessionWrapper>
            <Toaster
              toastOptions={{
                style: {
                  fontFamily: "var(--font-dm-sans)",
                  borderRadius: "2px",
                  fontSize: "0.875rem",
                },
              }}
            />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
