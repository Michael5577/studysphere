# StudySphere

**Your Academic Command Center** — a polished student productivity platform for managing courses, assignments, deadlines, focus time, and AI-powered studying.

**Live demo:** [https://studysph.me](https://studysph.me)

Built with Next.js, TypeScript, Tailwind CSS, Supabase, and OpenRouter AI.

## Overview

StudySphere brings everything a college student needs into one calm, focused workspace: course management, assignment tracking, a weekly calendar, a Pomodoro focus timer, and a built-in AI tutor that can explain concepts, draw diagrams, summarize notes, build flashcards, and generate interactive practice quizzes.

## Features

- **Authentication** — Secure signup, login, and logout via Supabase Auth
- **Dashboard** — Personalized overview with due-today stats, active courses, and focus time
- **Courses** — Create, edit, archive, and delete courses with color coding
- **Assignments** — Track deadlines, status, and priority with full CRUD
- **Calendar** — Week view of assignments grouped by due date
- **Focus Timer** — Pomodoro sessions with user preferences and session history
- **Profile & Settings** — Academic identity, productivity stats, timer durations, appearance
- **Themes** — Light/Dark/System color modes plus four background styles (Vivid, Organic, Minimal, Aurora)
- **Mobile-first UI** — Fixed app bars, bottom navigation, safe-area support, and PWA metadata

## AI Features

- **AI Tutor (Chat)** — Streaming chat tutor with Markdown, Mermaid diagrams, and SVG sketches
- **Summarize** — Paste notes and get structured summaries
- **Flashcards** — Generate study flashcards for any topic
- **Interactive Quizzes** — Choose question count (5/10/20), difficulty (easy/medium/hard/mixed), and Practice or Exam mode; answer clickable multiple-choice questions with instant feedback, streak tracking, celebrations, and a final score screen with weak-area review
- **Full-screen mode** — Expand the assistant into a ChatGPT-style full-screen workspace (Esc steps back)
- **Study History** — Recent chats, quizzes, flashcards, and summaries saved locally; reopen, delete, or clear anytime

## Screenshots

> _Screenshots coming soon — see the live demo at [studysph.me](https://studysph.me)._

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| AI | OpenRouter (default), NVIDIA DeepSeek, or OpenAI |
| Diagrams | Mermaid |
| Icons | Lucide React |
| Deployment | Vercel |

## Demo Login

Sign up with any email at [studysph.me/signup](https://studysph.me/signup) — accounts are provisioned instantly.

> **Demo credentials placeholder:** add a shared test account here before sending to reviewers, e.g. `demo@studysph.me` / `your-demo-password`.

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- A Supabase project

### 1. Clone and install

```bash
git clone <your-repo-url>
cd studysphere
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Legacy anon key (`eyJ...`) from Supabase → API Keys |
| `OPENROUTER_API_KEY` | For AI | OpenRouter API key (`sk-or-v1-...`) — recommended |
| `AI_PROVIDER` | For AI | `openrouter` (recommended), `nvidia`, `openai`, or `auto` |
| `OPENROUTER_MODEL` | Optional | Any OpenRouter model slug (default `deepseek/deepseek-chat`) |
| `NVIDIA_API_KEY` / `OPENAI_API_KEY` | Optional | Alternative AI providers |

> Use the **legacy anon key** (`eyJ...`) from the Legacy tab if auth requests fail with the publishable key.

### 3. Database schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor → New query**
3. Copy and run the full contents of [`supabase/schema.sql`](supabase/schema.sql)
4. Confirm these tables exist with RLS enabled: `profiles`, `user_preferences`, `courses`, `assignments`, `study_sessions`

Detailed verification steps are in [`PROJECT.md`](PROJECT.md#database-setup).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run lint + production build |
| `npm run icons` | Regenerate all icons (PNG, ICO) from `public/icon.svg` |

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the environment variables above (Production + Preview)
4. Deploy from branch `main`
5. Add your custom domain under **Project → Settings → Domains**

Ensure the Supabase schema is applied to your production project before testing.

**After changing any env var**, redeploy the latest Production deployment so the new values take effect.

### AI assistant notes

- Server route: `/api/assistant` — API keys never reach the client
- Streaming via Server-Sent Events; the server filters out model reasoning tokens
- Quiz responses are validated JSON — raw JSON is never rendered to users

## Architecture Notes

```
app/              # Next.js App Router pages, layouts, API routes
components/       # UI, layout, and feature components (assistant/, dashboard/, ...)
lib/              # Supabase clients, DB queries, server actions, AI providers
  ai/providers/   # OpenRouter, NVIDIA, OpenAI adapters + provider router
  theme/          # Design-token theme system (CSS vars + data attributes)
supabase/         # SQL schema
types/            # Shared TypeScript types
public/           # Static assets (icon, etc.)
```

- **AI provider router** — `AI_PROVIDER` picks the primary provider; the router falls back automatically if a provider fails
- **Theming** — CSS custom properties + `data-theme`/`data-bg` attributes on `<html>`, applied before first paint to avoid flashes
- **History** — AI study sessions persist in `localStorage` (no server round-trips)

## Roadmap

- [ ] Supabase-backed AI history sync across devices
- [ ] Spaced-repetition flashcard review
- [ ] Assignment reminders / notifications
- [ ] Shared study groups
- [ ] Grade tracking and GPA projections

## Environment Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.local.example` | Yes | Template for required env vars |
| `.env.local` | No (gitignored) | Your local secrets |

See [`PROJECT.md`](PROJECT.md) for product vision, design philosophy, and engineering standards.
