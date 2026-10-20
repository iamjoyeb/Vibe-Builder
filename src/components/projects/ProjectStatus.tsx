export default function ProjectStatus({
  previewOpen,
  onPreviewToggle,
  onOpenMenu,
  onOpenSettings,
}: {
  previewOpen: boolean;
  onPreviewToggle: () => void;
  onOpenMenu: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-3 py-2 sm:px-4">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100 md:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="size-4.5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <span className="text-sm font-semibold tracking-tight md:hidden">
        Vibe Builder
      </span>

      <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-amber-400/80"
        />
        <span className="hidden font-medium text-zinc-300 sm:inline">
          Status:
        </span>
        <span className="truncate">
          Application shell only — AI agent, storage and preview are not wired
          up yet.
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Open settings"
          onClick={onOpenSettings}
          className="grid size-8 place-items-center rounded-lg border border-line text-zinc-400 transition hover:border-line-strong hover:text-zinc-100 md:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onPreviewToggle}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-zinc-300 transition hover:border-accent/50 hover:bg-white/[0.04] hover:text-zinc-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {previewOpen ? "Back to chat" : "Preview"}
        </button>
      </div>
    </div>
  );
}
