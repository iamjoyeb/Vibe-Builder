export default function PreviewPanel({
  onBack,
  className = "",
}: {
  onBack: () => void;
  className?: string;
}) {
  return (
    <aside
      aria-label="Preview"
      className={`flex min-h-0 flex-col bg-background ${className}`}
    >
      <header className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Preview</h2>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
            Not implemented yet
          </span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-zinc-300 transition hover:border-line-strong hover:text-zinc-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            className="size-3.5"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Back
        </button>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-dashed border-white/15 text-zinc-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7"
            >
              <rect x="2" y="4" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 18v3" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Nothing to preview yet</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            The build agent has not been implemented, so no code has been
            generated — there is no site to render and nothing is running
            anywhere.
          </p>
          <p className="mt-3 rounded-xl border border-line bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-zinc-500">
            When preview support lands, generated projects will render here in
            a sandboxed iframe with a strict permission allow-list, isolated
            from the Vibe Builder interface and your data.
          </p>
        </div>
      </div>
    </aside>
  );
}
