// Which modules are paid. No imports: the proxy runs this on every request.

// Built into the page at build time, so changing it needs a new deployment.
export const paywallEnabled = process.env.NEXT_PUBLIC_PAYWALL_ENABLED === "1";

export const FIRST_PAID_MODULE = 5;

export const isPaidModule = (moduleNumber: number) => moduleNumber >= FIRST_PAID_MODULE;

export const isPaidPath = (pathname: string) => {
  const match = /^\/modules\/module-(\d+)(?:\/|$)/.exec(pathname);
  return !!match && isPaidModule(Number(match[1]));
};
