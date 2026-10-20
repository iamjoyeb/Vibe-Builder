import ProjectList from "@/components/projects/ProjectList";

export default function SidebarContent({
  onNewProject,
  onOpenSettings,
  showCloseButton = false,
  onClose,
}: {
  onNewProject: () => void;
  onOpenSettings: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-[0_0_24px_rgba(139,92,246,0.3)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M12 2.5 14 8l5.5 2-5.5 2-2 5.5L10 12 4.5 10 10 8l2-5.5Z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">Vibe Builder</p>
            <p className="text-[11px] text-zinc-500">AI web workspace</p>
          </div>
        </div>
        {showCloseButton && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="size-4"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNewProject}
        className="flex h-9 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white transition hover:bg-violet-400"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="size-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Project
      </button>

      <div className="min-h-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Projects
        </p>
        <ProjectList />
      </div>

      <div className="mt-auto space-y-2 border-t border-line pt-3">
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Local-only foundation. Nothing you type leaves this browser tab, and
          nothing is stored on disk yet.
        </p>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-zinc-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-zinc-400"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
}
