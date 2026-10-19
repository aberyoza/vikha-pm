import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { fixelDisplay, fixelText } from "@/fonts";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Віха — курс з управління проєктами",
    template: "%s · Віха",
  },
  description:
    "Безкоштовний курс з управління проєктами українською мовою на основі PMBOK 7 і 8.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#17140f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`${fixelText.variable} ${fixelDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-border">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-8">
            <Logo />
            <nav>
              <Link
                href="/#program"
                className="rounded-md px-3 py-2 text-[15px] text-muted transition-colors duration-200 hover:text-foreground"
              >
                Програма
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border">
          <div className="flex flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Logo />
            <p className="max-w-xl sm:text-right">
              Безкоштовний курс з управління проєктами. PMBOK® — зареєстрована
              торгова марка Project Management Institute, Inc. Курс не
              пов&apos;язаний з PMI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
