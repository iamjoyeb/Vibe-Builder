"use client";

import { useEffect, useRef, useState } from "react";
import ChatPanel from "@/components/chat/ChatPanel";
import SidebarContent from "@/components/layout/SidebarContent";
import PreviewPanel from "@/components/preview/PreviewPanel";
import ProjectList from "@/components/projects/ProjectList";
import ProjectStatus from "@/components/projects/ProjectStatus";
import SettingsPanel from "@/components/settings/SettingsPanel";
import {
  appendMessage,
  createProject,
  deleteProject,
  listMessages,
  listProjects,
  renameProject,
} from "@/lib/storage/projects";
import type { ChatItem, Project, ProjectMessage } from "@/types";

const AI_NOT_CONFIGURED_NOTICE =
  "AI integration is not configured yet. This message is a placeholder, not an AI reply. Your prompt was saved locally in this browser only — it was not sent to any provider and nothing was generated. Provider selection and API keys arrive in an upcoming task.";

/**
 * Maps a stored message to the runtime chat view model.
 * Stored records only ever contain role "user" in this task; the
 * "kind/token" split between ChatMessage and ChatNotice never reaches the
 * database (system notices are not persisted).
 */
function toChatItem(message: ProjectMessage): ChatItem {
  return {
    kind: "message",
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

function describeError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return `${fallback} (${error.message})`;
  }
  return fallback;
}

/** Kept local to the client shell; never called during build-time prerender. */
function createId() {
  return crypto.randomUUID();
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsStatus, setProjectsStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [projectsReloadToken, setProjectsReloadToken] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [messagesStatus, setMessagesStatus] = useState<
    "loading" | "ready" | "error"
  >("ready");
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);

  // Refs let event handlers see the latest values synchronously, which
  // prevents duplicate submissions while a save is still in flight.
  const selectedIdRef = useRef<string | null>(null);
  const savingRef = useRef(false);
  const creatingRef = useRef(false);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // Load the project list on mount (and again when "Try again" is pressed),
  // then select the most recent project so a refresh continues where the
  // user left off.
  useEffect(() => {
    let cancelled = false;
    setProjectsStatus("loading");
    listProjects()
      .then((stored) => {
        if (cancelled) return;
        setProjects(stored);
        setProjectsStatus("ready");
        setHistoryError(null);
        setSelectedId((current) => current ?? stored[0]?.id ?? null);
      })
      .catch((error) => {
        if (cancelled) return;
        setProjectsStatus("error");
        setHistoryError(
          describeError(error, "Could not load your saved projects."),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [projectsReloadToken]);

  // Load the selected project's messages whenever the selection changes.
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      setMessagesStatus("ready");
      return;
    }
    let cancelled = false;
    setMessagesStatus("loading");
    listMessages(selectedId)
      .then((stored) => {
        if (cancelled) return;
        setMessages(stored.map(toChatItem));
        setMessagesStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setMessages([]);
        setMessagesStatus("error");
        setHistoryError(
          describeError(error, "Could not load this conversation."),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleNewProject = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    try {
      const project = await createProject();
      setProjects((previous) => sortProjects([...previous, project]));
      setSelectedId(project.id); // new chat starts empty
      setHistoryError(null);
    } catch (error) {
      setHistoryError(describeError(error, "Could not create the project."));
    } finally {
      creatingRef.current = false;
    }
  };

  const handleSend = async (text: string): Promise<boolean> => {
    if (savingRef.current) return false; // one save at a time
    savingRef.current = true;
    setSavingMessage(true);

    try {
      // Auto-create a project when the user sends the very first prompt
      // without selecting one, so there is no dead end.
      let targetId = selectedIdRef.current;
      if (!targetId) {
        const project = await createProject();
        setProjects((previous) => sortProjects([...previous, project]));
        setSelectedId(project.id);
        targetId = project.id;
      }

      // Persist first — only a successful save is displayed as recorded.
      const saved = await appendMessage(targetId, text);

      setMessages((previous) => {
        const next: ChatItem[] = [...previous, toChatItem(saved.message)];
        // The "not configured" notice is shown once per session and is
        // never stored in IndexedDB.
        if (!previous.some((item) => item.kind === "notice")) {
          next.push({
            kind: "notice",
            id: createId(),
            content: AI_NOT_CONFIGURED_NOTICE,
            createdAt: saved.message.createdAt,
          });
        }
        return next;
      });
      setProjects((previous) =>
        sortProjects(
          previous.map((project) =>
            project.id === saved.project.id ? saved.project : project,
          ),
        ),
      );
      setHistoryError(null);
      return true;
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          kind: "notice",
          id: createId(),
          tone: "error",
          content: describeError(
            error,
            "Your message could not be saved locally. Nothing was sent, and your text is still in the input.",
          ),
          createdAt: new Date().toISOString(),
        },
      ]);
      return false;
    } finally {
      savingRef.current = false;
      setSavingMessage(false);
    }
  };

  const handleRename = async (id: string, name: string) => {
    try {
      const updated = await renameProject(id, name);
      setProjects((previous) =>
        sortProjects(
          previous.map((project) => (project.id === updated.id ? updated : project)),
        ),
      );
      setHistoryError(null);
    } catch (error) {
      setHistoryError(describeError(error, "Could not rename the project."));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Delete “${name}” and its saved chat history? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await deleteProject(id);
      const remaining = projects.filter((project) => project.id !== id);
      setProjects(remaining);
      // Leaving a valid selection: pick the most recent remaining project.
      if (selectedId === id) {
        setSelectedId(remaining[0]?.id ?? null);
      }
      setHistoryError(null);
    } catch (error) {
      setHistoryError(
        describeError(error, "Could not delete the project — nothing was removed."),
      );
    }
  };

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

  const openSettings = () => setSettingsOpen(true);
  const selectedProject = projects.find((project) => project.id === selectedId);

  const projectHistory = (
    <ProjectList
      projects={projects}
      selectedId={selectedId}
      isLoading={projectsStatus === "loading"}
      error={historyError}
      onSelect={(id) => {
        setSelectedId(id);
        setMenuOpen(false);
      }}
      onRename={handleRename}
      onDelete={handleDelete}
      onRetry={() => setProjectsReloadToken((token) => token + 1)}
    />
  );

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-line bg-white/[0.02] md:flex md:flex-col">
        <SidebarContent
          onNewProject={handleNewProject}
          onOpenSettings={openSettings}
          history={projectHistory}
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
              history={projectHistory}
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
          projectName={selectedProject?.name ?? null}
        />
        <div className="flex min-h-0 flex-1">
          <div
            className={`min-w-0 flex-1 ${previewOpen ? "hidden md:flex" : "flex"}`}
          >
            <ChatPanel
              messages={messages}
              messagesStatus={messagesStatus}
              isSending={savingMessage}
              onSend={handleSend}
            />
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
