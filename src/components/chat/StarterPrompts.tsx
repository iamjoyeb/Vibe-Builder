import type { SuggestedPrompt } from "@/types";

const GROUPS: { group: string; items: SuggestedPrompt[] }[] = [
  {
    group: "Websites",
    items: [
      {
        id: "portfolio",
        title: "Personal portfolio",
        detail: "Hero section, project grid and a contact section",
        prompt:
          "Build a personal portfolio website with a hero section, a grid of projects with short descriptions, and a contact section at the bottom.",
      },
      {
        id: "landing",
        title: "SaaS landing page",
        detail: "Feature highlights, pricing tiers and a FAQ",
        prompt:
          "Build a landing page for a SaaS product with feature highlights, three pricing tiers and a short FAQ section.",
      },
      {
        id: "restaurant",
        title: "Restaurant site",
        detail: "Menu, opening hours and location info",
        prompt:
          "Build a simple restaurant website with a menu section, opening hours and a location section.",
      },
    ],
  },
  {
    group: "Web apps",
    items: [
      {
        id: "tasks",
        title: "Task tracker",
        detail: "Multiple lists with task completion",
        prompt:
          "Build a task tracker web app with multiple lists, task completion and a dark mode toggle.",
      },
      {
        id: "notes",
        title: "Notes app",
        detail: "Colour-coded tags and a search box",
        prompt:
          "Build a notes web app with colour-coded tags and a search box that filters as you type.",
      },
      {
        id: "weather",
        title: "Weather dashboard",
        detail: "Five-day forecast from sample data",
        prompt:
          "Build a weather dashboard that shows a five-day forecast using a built-in sample dataset.",
      },
    ],
  },
];

export default function StarterPrompts({
  onPick,
}: {
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="space-y-6">
      {GROUPS.map(({ group, items }) => (
        <div key={group}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {group}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.prompt)}
                className="group rounded-xl border border-line bg-white/[0.03] p-3.5 text-left transition hover:border-accent/40 hover:bg-accent-soft"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-medium text-zinc-100">
                  {item.title}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5 shrink-0 text-zinc-600 transition group-hover:text-accent"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
                  {item.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
