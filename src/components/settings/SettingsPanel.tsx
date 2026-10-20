"use client";

import { useEffect, useRef } from "react";

const PROVIDERS = ["OpenAI", "Anthropic", "Google AI", "OpenRouter"] as const;

export default function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog when it opens (backdrop and Escape close it).
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="rise-in relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-zinc-950 shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <h2 id="settings-title" className="text-base font-semibold">
              Settings
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Placeholder for now — provider wiring lands in an upcoming task.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close settings"
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
        </header>

        <div className="max-h-[60vh] space-y-5 overflow-y-auto px-5 py-4">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              AI provider
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Choose who powers your agent later. Nothing here sends network
              requests yet.
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PROVIDERS.map((provider) => (
                <div
                  key={provider}
                  className="flex items-center justify-between rounded-xl border border-line bg-white/[0.03] px-3 py-2.5"
                >
                  <span className="text-sm text-zinc-300">{provider}</span>
                  <span className="rounded-full border border-line bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                    Planned
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <label
              htmlFor="api-key"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              API key
            </label>
            <input
              id="api-key"
              type="password"
              disabled
              placeholder="Disabled — key entry arrives with provider wiring"
              className="mt-2 w-full rounded-xl border border-line bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-400 placeholder:text-zinc-600 disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Planned behavior: your key is kept in this browser tab only. It
              disappears when you close Vibe Builder and is never written to
              disk, sent to a Vibe Builder server (there is none), or added to
              URLs or logs.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              GitHub
            </h3>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-line bg-white/[0.03] px-3 py-2.5">
              <span className="text-sm text-zinc-300">
                Repository access and commits
              </span>
              <span className="rounded-full border border-line bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                Planned
              </span>
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5">
          <p className="text-[11px] text-zinc-600">
            This dialog does not persist anything.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            Got it
          </button>
        </footer>
      </div>
    </div>
  );
}
