<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Vibe Builder

Instructions for OpenCode (and any coding agent) working on Vibe Builder. These rules are persistent and apply to every future task.

## Project snapshot

Vibe Builder is a **browser-first, chat-driven workspace**: the owner describes a website or web app, an AI agent plans and builds it, with a sandboxed preview and local project storage. There is **no mandatory backend**.

- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4, npm.
- **Build target:** static export (`output: "export"` in `next.config.ts`) → static site in `out/`. Deployable to any static host.
- **Current status:** foundation shell (Task 002). Chat input, preview and settings are honest UI placeholders — AI calls, storage, GitHub and the preview engine are **not implemented**. Never present them as working.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Type-checks and statically exports into `out/` |
| `npm run lint` | ESLint via `eslint-config-next` |
| `npm run typecheck` | Standalone `tsc --noEmit` |

## Source layout

```
src/app/         App Router entry: layout.tsx, page.tsx, globals.css, favicon.ico
src/components/
  chat/          Chat panel, composer, empty state, starter prompts
  projects/      Sidebar project list (empty state) + project status strip
  preview/       Preview panel placeholder (no iframe engine yet)
  settings/      Settings dialog placeholder (nothing persisted)
  layout/        Shared sidebar content (desktop rail + mobile drawer)
src/types/       Shared types (ChatItem/ChatMessage/ChatNotice, SuggestedPrompt)
public/          Static assets (currently empty)
```

Reserved for future tasks — **create each module only when implementing it**. Do not leave empty stub files, and never add fake implementations that look production-ready:

| Module | Responsibility | Rules |
| --- | --- | --- |
| `src/lib/agent/` | Prompt → plan → code-generation orchestration | Owns the pipeline; hands structured jobs to providers |
| `src/lib/providers/` | AI provider adapters (OpenAI, Anthropic, Google AI, OpenRouter) | Client-side `fetch` only; one file per provider; keys supplied by the user at runtime |
| `src/lib/storage/` | IndexedDB project persistence | Browser-only; access `indexedDB`/`window` inside effects/handlers, never at module top level |
| `src/lib/github/` | GitHub REST integration (repos, branches, commits) | Client-side; per-session token supplied by the user |
| `src/lib/preview/` | Sandboxed iframe rendering of generated code | Owns the `sandbox` attribute allow-list; never render generated code into the app DOM |

## Hard rules

1. **No mandatory backend.** No route handlers, server actions, `middleware`/`proxy`, server-only packages, or server-side secrets anywhere in the critical path. Any deviation must be reported and approved first.
2. **Static export stays green.** `npm run build` must succeed with `output: "export"`. Do not use cookies/headers/rewrites/redirects, ISR, draft mode, intercepting routes, or the default `next/image` loader (`images.unoptimized: true` is set deliberately).
3. **Browser APIs are runtime-only.** Client components are prerendered to HTML at build time under static export, so `window`, `document`, `localStorage`, `sessionStorage`, `indexedDB` and friends may only be accessed inside `"use client"` components, within effects and event handlers — never at module top level and never during server rendering.
4. **Secrets stay in the session.** API keys and GitHub tokens live only in tab memory (later: `sessionStorage`-style flow is not allowed either unless explicitly approved). Never hard-code secrets in source, and never persist them to localStorage, sessionStorage, IndexedDB, URLs, history, or logs.
5. **Generated code is untrusted.** It may only be rendered inside a sandboxed iframe with a strict `sandbox` allow-list, and never combined `allow-scripts` + `allow-same-origin`. Never use `dangerouslySetInnerHTML` for generated content. Never execute generated code in the app window.
6. **No heavyweight dependencies.** No Monaco or other code editors in the MVP; no databases, ORMs, auth middleware, or backend frameworks. Propose lighter alternatives instead.
7. **Honesty over demo value.** Never fake a working AI reply, GitHub commit, saved project, or preview. If a feature is not implemented, the UI must say so clearly (see the amber "not configured yet" notice and the Preview panel placeholder).
8. **Do not overclaim.** Do not state that generated npm projects can run in the browser until a real execution strategy is designed and approved.
9. **Inspect before changing.** Read the surrounding files before editing; keep changes incremental and explainable to a beginner; report real command output and results, never claimed success.

## Working notes

- Any TypeScript declaration "magic" like `LayoutProps<"/">` comes from Next.js generated types (`.next/types`); do not edit `next-env.d.ts`.
- New pages must prerender with static metadata and no request-time data.
- `crypto.randomUUID()` is only called in client event handlers (build-time prerender has no conversation state).
- Keep code beginner-readable: small components, obvious names, minimal abstraction.
