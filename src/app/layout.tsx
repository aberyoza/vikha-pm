import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AccountMenu } from "@/components/auth/account-menu";
import { CloudSync } from "@/components/auth/cloud-sync";
import { Logo } from "@/components/logo";
import { themeInitScript } from "@/components/theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { CONTACT_EMAIL, INDEXABLE, OPEN_GRAPH, SITE_NAME, SITE_URL } from "@/content/site";
import { authEnabled } from "@/lib/auth";
import { COURSE_KIND, FREE_PART, paywallEnabled } from "@/lib/paywall";
import { fixelDisplay, fixelText } from "@/fonts";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Віха — курс з управління проєктами",
    template: "%s · Віха",
  },
  description: `${COURSE_KIND} з управління проєктами українською мовою на основі PMBOK 7 і 8.${paywallEnabled ? ` ${FREE_PART}` : ""}`,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { ...OPEN_GRAPH, type: "website", url: "/" },
  twitter: { card: "summary_large_image" },
  robots: INDEXABLE ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#111316",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fixelText.variable} ${fixelDisplay.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-border print:hidden">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-8">
            <Logo />
            <nav className="flex items-center gap-1">
              <Link
                href="/#program"
                className={`rounded-md px-3 py-2 text-[15px] text-muted transition-colors duration-200 hover:text-foreground ${authEnabled ? "hidden sm:block" : ""}`}
              >
                Програма
              </Link>
              <Link
                href="/my-project"
                className="rounded-md px-3 py-2 text-[15px] text-muted transition-colors duration-200 hover:text-foreground"
              >
                Мій проєкт
              </Link>
              {authEnabled && (
                <Suspense fallback={null}>
                  <AccountMenu />
                </Suspense>
              )}
              <ThemeToggle />
            </nav>
          </div>
        </header>
        {authEnabled && <CloudSync />}
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border print:hidden">
          <div className="flex flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Logo />
            <div className="max-w-xl sm:text-right">
              <p>
                {COURSE_KIND} з управління проєктами. PMBOK® — зареєстрована
                торгова марка Project Management Institute, Inc. Курс не
                пов&apos;язаний з PMI.
              </p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 sm:justify-end">
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 transition-colors duration-200 hover:text-foreground">
                  {CONTACT_EMAIL}
                </a>
                <Link href="/privacy" className="underline underline-offset-4 transition-colors duration-200 hover:text-foreground">
                  Політика конфіденційності
                </Link>
                {paywallEnabled && (
                  <Link href="/offer" className="underline underline-offset-4 transition-colors duration-200 hover:text-foreground">
                    Договір оферти
                  </Link>
                )}
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
