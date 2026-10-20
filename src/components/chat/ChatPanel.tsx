"use client";

import { useEffect, useRef, useState } from "react";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import type { ChatItem, ChatMessage, ChatNotice } from "@/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <li className="rise-in flex flex-col items-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-accent/30 bg-accent-soft px-4 py-2.5 text-sm leading-relaxed text-zinc-100">
        {message.content}
      </div>
      <span className="mt-1 text-[10px] text-zinc-500">
        You · {formatTime(message.createdAt)}
      </span>
    </li>
  );
}

function NoticeBubble({ notice }: { notice: ChatNotice }) {
  return (
    <li className="rise-in flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        className="mt-0.5 size-4 shrink-0 text-amber-300"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v.5M12 11.5V16" />
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/90">
          Vibe Builder
        </p>
        <p className="mt-1 text-sm leading-relaxed text-amber-100/90">
          {notice.content}
        </p>
      </div>
    </li>
  );
}

export default function ChatPanel({
  messages,
  onSend,
}: {
  messages: ChatItem[];
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view once the conversation grows.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // Grow the composer with its content, capped at ~5 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <section aria-label="Chat" className="flex min-w-0 flex-1 flex-col">
      <div
        ref={listRef}
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6"
      >
        <div className="mx-auto w-full max-w-2xl py-6">
          {messages.length === 0 ? (
            <ChatEmptyState onPick={(prompt) => {
              setDraft(prompt);
              inputRef.current?.focus();
            }} />
          ) : (
            <ol className="space-y-4">
              {messages.map((item) =>
                item.kind === "notice" ? (
                  <NoticeBubble key={item.id} notice={item} />
                ) : (
                  <UserBubble key={item.id} message={item} />
                ),
              )}
            </ol>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitDraft();
        }}
        noValidate
        className="border-t border-line bg-zinc-950/70 px-3 py-3 backdrop-blur sm:px-6 sm:py-4"
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-white/[0.04] p-2 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.06]">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitDraft();
                }
              }}
              rows={1}
              aria-label="Your prompt"
              placeholder="Describe the website or web app you want to build…"
              className="max-h-40 flex-1 resize-none self-end bg-transparent px-2 py-2 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send prompt"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-zinc-500">
            <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for a
            new line
          </p>
        </div>
      </form>
    </section>
  );
}
