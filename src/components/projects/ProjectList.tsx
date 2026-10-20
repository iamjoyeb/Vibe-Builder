export default function ProjectList() {
  return (
    <div className="mt-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
      <p className="text-xs font-medium text-zinc-300">No projects yet</p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Projects you create will be listed here and saved in your browser
        (IndexedDB) in an upcoming task.
      </p>
    </div>
  );
}
