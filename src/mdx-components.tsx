import type { MDXComponents } from "mdx/types";

// Lessons are styled by the `prose` wrapper in the lesson page,
// so no element overrides are needed yet.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
