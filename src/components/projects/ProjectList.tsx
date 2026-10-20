import { useRef, useState } from "react";
import type { Project } from "@/types";

function RowIcon({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export default function ProjectList({
  projects,
  selectedId,
  isLoading,
  error,
  onSelect,
  onRename,
  onDelete,
  onRetry,
}: {
  projects: Project[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  onRetry: () => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  // Prevents commit firing twice (Enter submit + blur after a rename).
  const committedRef = useRef(false);

  const beginRename = (project: Project) => {
    committedRef.current = false;
    setRenamingId(project.id);
    setDraftName(project.name);
  };

  const commitRename = (project: Project) => {
    if (committedRef.current) return;
    committedRef.current = true;
    setRenamingId(null);
    const next = draftName.trim();
    if (next && next !== project.name) onRename(project.id, next);
  };

  const cancelRename = () => {
    committedRef.current = true;
    setRenamingId(null);
  };

  return (
    <div className="mt-2">
      {isLoading && projects.length === 0 && (
        <p className="px-1 py-2 text-xs text-zinc-500">Loading projects…</p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-400/[0.06] p-2.5">
          <p className="text-[11px] leading-relaxed text-rose-200/90">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-1.5 text-[11px] font-medium text-rose-300 underline-offset-2 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {projects.length === 0 && !isLoading && !error && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
          <p className="text-xs font-medium text-zinc-300">No projects yet</p>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
            Use “New Project” to start one. Projects are saved in your browser
            only.
          </p>
        </div>
      )}

      <div className="space-y-0.5" role="list">
        {projects.map((project) =>
          renamingId === project.id ? (
            <div key={project.id} className="flex items-center gap-1 p-0.5">
              <input
                autoFocus
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelRename();
                  }
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitRename(project);
                  }
                }}
                onBlur={() => commitRename(project)}
                aria-label="Project name"
                className="h-8 w-full min-w-0 rounded-lg border border-accent/50 bg-white/[0.05] px-2 text-sm text-zinc-100 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Save project name"
                onClick={() => commitRename(project)}
                className="grid size-6 shrink-0 place-items-center rounded-md text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
              >
                <RowIcon className="size-3.5">
                  <path d="M20 6 9 17l-5-5" />
                </RowIcon>
              </button>
              <button
                type="button"
                aria-label="Cancel renaming"
                onClick={cancelRename}
                className="grid size-6 shrink-0 place-items-center rounded-md text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
              >
                <RowIcon className="size-3.5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </RowIcon>
              </button>
            </div>
          ) : (
            <div
              key={project.id}
              role="listitem"
              className={`group flex h-8 items-center gap-1 rounded-lg px-1.5 transition ${
                project.id === selectedId
                  ? "bg-white/[0.06] text-zinc-100"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(project.id)}
                title={project.name}
                className="flex-1 truncate text-left text-sm"
              >
                {project.name}
              </button>
              <button
                type="button"
                aria-label={`Rename ${project.name}`}
                onClick={() => beginRename(project)}
                className="grid size-6 shrink-0 place-items-center rounded-md text-zinc-500 opacity-60 transition hover:bg-white/[0.05] hover:text-zinc-200 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <RowIcon className="size-3.5">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                </RowIcon>
              </button>
              <button
                type="button"
                aria-label={`Delete ${project.name}`}
                onClick={() => onDelete(project.id, project.name)}
                className="grid size-6 shrink-0 place-items-center rounded-md text-zinc-500 opacity-60 transition hover:bg-white/[0.05] hover:text-rose-300 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <RowIcon className="size-3.5">
                  <path d="M3 6h18" />
                  <path d="M9 6V4h6v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </RowIcon>
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
