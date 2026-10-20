import Link from "next/link";
import { Figure } from "./figure";

export type MapLeaf = { label: string; note?: string };
export type MapBranch = {
  title: string;
  href: string;
  // e.g. "Урок 2" or "Модуль 3"
  tag: string;
  leaves: MapLeaf[];
};

type MindMapProps = {
  title: string;
  lead: string;
  center: string;
  centerNote: string;
  branches: MapBranch[];
  caption?: string;
};

function BranchCard({ branch }: { branch: MapBranch }) {
  return (
    <div className="rounded-[4px] border border-border bg-surface p-4">
      <p className="text-[13px] text-muted">{branch.tag}</p>
      <Link
        href={branch.href}
        className="mt-0.5 block font-display text-lg leading-snug font-semibold text-foreground underline decoration-border decoration-2 underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
      >
        {branch.title}
      </Link>
      <ul className="mt-3 space-y-1.5 text-sm">
        {branch.leaves.map((leaf) => (
          <li key={leaf.label} className="flex gap-2">
            <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
            <span>
              <span className="font-medium">{leaf.label}</span>
              {leaf.note && <span className="text-muted"> — {leaf.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Center({ center, note }: { center: string; note: string }) {
  return (
    <div className="rounded-[4px] bg-accent p-5 text-center text-accent-foreground">
      <span aria-hidden className="mx-auto mb-3 block size-4 rotate-45 rounded-[2px] bg-accent-foreground/90" />
      <p className="font-display text-xl leading-tight font-semibold">{center}</p>
      <p className="mt-2 text-sm opacity-90">{note}</p>
    </div>
  );
}

// A mind map of a module: the module's question in the middle, one branch
// per lesson with its key ideas. Wide figures get a two-sided map with
// connector lines; narrow ones a vertical tree.
export function MindMap({ title, lead, center, centerNote, branches, caption }: MindMapProps) {
  const half = Math.ceil(branches.length / 2);
  const left = branches.slice(0, half);
  const right = branches.slice(half);

  return (
    <Figure title={title} lead={lead} caption={caption}>
      {/* Wide: branches on both sides of the centre */}
      <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,15rem)_minmax(0,1fr)] items-center @3xl:grid">
        <div className="relative space-y-4 pr-6">
          <span aria-hidden className="absolute top-12 right-0 bottom-12 w-0.5 bg-border" />
          {left.map((b) => (
            <div key={b.title} className="relative after:absolute after:top-1/2 after:-right-6 after:h-0.5 after:w-6 after:bg-border">
              <BranchCard branch={b} />
            </div>
          ))}
        </div>
        <div className="relative px-6 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-6 before:bg-border after:absolute after:top-1/2 after:right-0 after:h-0.5 after:w-6 after:bg-border">
          <Center center={center} note={centerNote} />
        </div>
        <div className="relative space-y-4 pl-6">
          <span aria-hidden className="absolute top-12 bottom-12 left-0 w-0.5 bg-border" />
          {right.map((b) => (
            <div key={b.title} className="relative before:absolute before:top-1/2 before:-left-6 before:h-0.5 before:w-6 before:bg-border">
              <BranchCard branch={b} />
            </div>
          ))}
        </div>
      </div>

      {/* Narrow: centre on top, branches as a tree below */}
      <div className="@3xl:hidden">
        <Center center={center} note={centerNote} />
        <div className="relative mt-4 ml-3 space-y-3 border-l-2 border-border pl-5">
          {branches.map((b) => (
            <div key={b.title} className="relative before:absolute before:top-6 before:-left-5 before:h-0.5 before:w-5 before:bg-border">
              <BranchCard branch={b} />
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
