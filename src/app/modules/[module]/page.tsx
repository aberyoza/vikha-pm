import { notFound, redirect } from "next/navigation";
import { publishedModules } from "@/content/course";

export function generateStaticParams() {
  return publishedModules.map((m) => ({ module: m.slug }));
}

export const instant = false;

// A module has no page of its own: open its first lesson.
export default async function ModulePage({
  params,
}: PageProps<"/modules/[module]">) {
  const { module: moduleSlug } = await params;
  const courseModule = publishedModules.find((m) => m.slug === moduleSlug);
  if (!courseModule) notFound();
  redirect(`/modules/${courseModule.slug}/${courseModule.lessons[0].slug}`);
}
