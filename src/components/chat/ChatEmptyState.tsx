import StarterPrompts from "@/components/chat/StarterPrompts";

const CAPABILITY_CHIPS: { label: string; planned?: boolean }[] = [
  { label: "Browser-first — no backend" },
  { label: "Projects saved in your browser" },
  { label: "Sandboxed previews", planned: true },
];

export default function ChatEmptyState({
  onPick,
}: {
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="py-6 sm:py-10">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.35)]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path d="M12 2.5 14 8l5.5 2-5.5 2-2 5.5L10 12 4.5 10 10 8l2-5.5Z" />
            <path
              d="M18.5 15.5 19.4 18l2.6.9-2.6 1-.9 2.5-1-2.5-2.5-1 2.5-.9 1-2.5Z"
              opacity={0.7}
            />
          </svg>
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
          Vibe Builder
        </p>
      </div>

      <h1 className="mt-5 bg-gradient-to-r from-zinc-50 via-zinc-200 to-violet-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
        Build a website by describing it
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        Vibe Builder is a chat-first workspace for creating sites and web apps.
        Type an idea below — prompts and projects are saved locally in your
        browser, while the AI agent, code generation and sandboxed preview
        arrive in upcoming tasks.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {CAPABILITY_CHIPS.map((chip) => (
          <li
            key={chip.label}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-zinc-400"
          >
            {chip.label}
            {chip.planned && (
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 text-[10px] font-medium text-violet-300">
                soon
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <StarterPrompts onPick={onPick} />
      </div>
    </div>
  );
}
