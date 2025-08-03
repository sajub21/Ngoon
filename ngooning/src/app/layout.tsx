import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NGooning - AI Social Recovery & Lifestyle Planner",
  description: "Stop watching porn, rebuild your life, make new friends, and plan real-world experiences with our AI assistant Goon.",
  keywords: ["social recovery", "lifestyle planner", "AI assistant", "habit tracking", "friend discovery"],
  authors: [{ name: "NGooning Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f0f3" },
    { media: "(prefers-color-scheme: dark)", color: "#2d3748" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="relative min-h-screen">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-neo-50 via-neo-100 to-neo-200 dark:from-neo-900 dark:via-neo-800 dark:to-neo-700 -z-10" />
          
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
          </div>
          
          {/* Main navigation */}
          <Navbar />
          
          {/* Main content */}
          <main className="relative z-10 pt-20 pb-24 md:pt-24 md:pb-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
