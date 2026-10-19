import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Віха — курс з управління проєктами",
    template: "%s · Віха",
  },
  description:
    "Безкоштовний курс з управління проєктами українською мовою на основі PMBOK 7 і 8.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-border">
          <div className="flex h-14 items-center px-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Віха
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border">
          <div className="px-4 py-6 text-sm text-muted sm:px-6">
            <p>© 2026 Віха</p>
            <p className="mt-1">
              PMBOK® — зареєстрована торгова марка Project Management Institute,
              Inc. Курс не пов&apos;язаний з PMI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
