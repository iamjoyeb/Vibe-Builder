"use client";

import { useCallback, useEffect, useState } from "react";
import ChatPanel from "@/components/chat/ChatPanel";
import SidebarContent from "@/components/layout/SidebarContent";
import PreviewPanel from "@/components/preview/PreviewPanel";
import ProjectStatus from "@/components/projects/ProjectStatus";
import SettingsPanel from "@/components/settings/SettingsPanel";
import type { ChatItem } from "@/types";

const AI_NOT_CONFIGURED_NOTICE =
  "AI integration is not configured yet. This message is a placeholder, not an AI reply: your prompt was not sent anywhere and nothing was generated or saved. Provider selection and API keys will be set up in Settings once that task is done.";

const PROJECT_PERSISTENCE_NOTICE =
  "Project persistence is not implemented yet (IndexedDB arrives in an upcoming task), so this simply started a fresh chat in your current tab. Nothing was saved or deleted.";

/** Kept local to the client shell; never called during build-time prerender. */
function createId() {
  return crypto.randomUUID();
}

export default function Home() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSend = useCallback((text: string) => {
    setMessages((previous) => {
      const now = new Date().toISOString();
      const next: ChatItem[] = [
        ...previous,
        {
          kind: "message",
          id: createId(),
          role: "user",
          content: text,
          createdAt: now,
        },
      ];
      // Show the "not configured" notice once, no matter how many prompts are sent.
      if (!previous.some((item) => item.kind === "notice")) {
        next.push({
          kind: "notice",
          id: createId(),
          content: AI_NOT_CONFIGURED_NOTICE,
          createdAt: now,
        });
      }
      return next;
    });
  }, []);

  const handleNewProject = useCallback(() => {
    setMenuOpen(false);
    setPreviewOpen(false);
    setMessages([
      {
        kind: "notice",
        id: createId(),
        content: PROJECT_PERSISTENCE_NOTICE,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  // Escape closes overlays top-down: settings, menu, preview.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSettingsOpen(false);
      setMenuOpen(false);
      setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-line bg-white/[0.02] md:flex md:flex-col">
        <SidebarContent
          onNewProject={handleNewProject}
          onOpenSettings={openSettings}
        />
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Projects and settings"
          className="fixed inset-0 z-40 md:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-zinc-950 shadow-2xl">
            <SidebarContent
              showCloseButton
              onClose={() => setMenuOpen(false)}
              onNewProject={handleNewProject}
              onOpenSettings={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <ProjectStatus
          previewOpen={previewOpen}
          onPreviewToggle={() => setPreviewOpen((open) => !open)}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSettings={openSettings}
        />
        <div className="flex min-h-0 flex-1">
          <div
            className={`min-w-0 flex-1 ${previewOpen ? "hidden md:flex" : "flex"}`}
          >
            <ChatPanel messages={messages} onSend={handleSend} />
          </div>
          {previewOpen && (
            <PreviewPanel
              onBack={() => setPreviewOpen(false)}
              className="fixed inset-0 z-30 md:static md:z-auto md:w-[46%] md:shrink-0 md:border-l md:border-line"
            />
          )}
        </div>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
