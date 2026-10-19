import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Logo } from "@/components/logo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const serif = Source_Serif_4({
  variable: "--font-serif-display",
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
    <html
      lang="uk"
      className={`${inter.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Logo />
            <nav className="text-sm">
              <Link
                href="/#program"
                className="rounded-md px-3 py-2 text-muted transition-colors duration-200 hover:text-foreground"
              >
                Програма
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border">
          <div className="flex flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <Logo />
            <div className="sm:text-right">
              <p>© 2026 Віха. Безкоштовний курс з управління проєктами.</p>
              <p className="mt-1">
                PMBOK® — зареєстрована торгова марка Project Management
                Institute, Inc. Курс не пов&apos;язаний з PMI.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
