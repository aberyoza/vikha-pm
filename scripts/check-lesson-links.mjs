// Fails when a lesson links to a course page that doesn't exist, e.g. after a
// lesson is renamed. Checks markdown links of the form (/modules/<module>/<lesson>).
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = "src/content/modules";
const broken = [];

for (const mod of readdirSync(root)) {
  for (const file of readdirSync(join(root, mod)).filter((f) => f.endsWith(".mdx"))) {
    const text = readFileSync(join(root, mod, file), "utf8");
    for (const [, target, lesson] of text.matchAll(/\]\(\/modules\/(module-\d+)\/([a-z0-9-]+)\)/g)) {
      if (!existsSync(join(root, target, `${lesson}.mdx`))) broken.push(`${mod}/${file} → /modules/${target}/${lesson}`);
    }
  }
}

if (broken.length) {
  console.error(`Broken lesson links:\n${broken.join("\n")}`);
  process.exit(1);
}
