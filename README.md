# Vibe Builder

A browser-first AI workspace: describe the website or web app you want, and an AI agent builds it with you — chat first, sandboxed preview, projects saved locally, zero backend.

> **Status:** foundation shell + local persistence (Tasks 002–003). The interface works; projects and prompts are saved locally in your browser via IndexedDB (schema in [`AGENTS.md`](./AGENTS.md)), while the AI agent, GitHub integration and the preview engine are upcoming tasks and appear as honest placeholders in the UI.

## Stack

- Next.js 16 — App Router, static export, Turbopack
- React 19, TypeScript (strict)
- Tailwind CSS v4
- npm

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm run lint
npm run typecheck
```

## Deployment

`next build` produces a fully static site in `out/` — host it anywhere that serves static files (GitHub Pages, Cloudflare Pages, Netlify, any web server). No Node server is required.
