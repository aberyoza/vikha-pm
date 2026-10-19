import type { MDXComponents } from "mdx/types";
import { CpmPert } from "@/components/lesson/cpm-pert";
import { CriticalPath } from "@/components/lesson/critical-path";
import { Ecosystem } from "@/components/lesson/ecosystem";
import { PmbokOrigin } from "@/components/lesson/pmbok";

// Text is styled by the `prose` wrapper in the lesson page. Illustrations
// registered here can be used in any lesson without an import.
const components: MDXComponents = {
  CpmPert,
  CriticalPath,
  Ecosystem,
  PmbokOrigin,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
