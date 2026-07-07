# StudySphere

**Your Academic Command Center** — a production-ready student productivity app for managing courses, assignments, deadlines, and focus time.

Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication** — Secure signup, login, and logout via Supabase Auth
- **Dashboard** — Personalized overview with due-today stats, active courses, and focus time
- **Courses** — Create, edit, archive, and delete courses with color coding
- **Assignments** — Track deadlines, status, and priority with full CRUD
- **Calendar** — Week view of assignments grouped by due date
- **Focus Timer** — Pomodoro sessions with user preferences and session history
- **Profile** — Edit academic identity and view productivity stats
- **Settings** — Timer durations, notification toggles, compact mode, and assignment visibility
- **Mobile-first UI** — Fixed app bars, bottom navigation, safe-area support, and PWA metadata

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Icons | Lucide React |
| Deployment | Vercel |

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

Fill in your Supabase credentials from **Project Settings → API Keys**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-legacy-anon-key
```

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

### 5. Test account

Create a test user via the signup page, or add one in **Supabase → Authentication → Users**. On first login, profile and preference rows are bootstrapped automatically.

> **Demo placeholder:** Replace with your own test credentials before sharing the deployed app.

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
3. Add environment variables (Production + Preview):

   | Variable | Purpose |
   |----------|---------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon key (`eyJ...`) from Supabase → API Keys |
   | `NVIDIA_API_KEY` | NVIDIA Build API key (`nvapi-...`) — powers the AI assistant |
   | `AI_PROVIDER` | Set to `nvidia` (recommended) |

   Optional fallback: `OPENAI_API_KEY` + `AI_PROVIDER=auto`

4. Deploy from branch `main`

Ensure the Supabase schema is applied to your production project before testing.

**After changing any env var**, redeploy the latest Production deployment so the new values take effect.

### AI assistant (NVIDIA DeepSeek V4 Flash)

- Server route: `/api/assistant` (never expose API keys to the client)
- Model: `deepseek-ai/deepseek-v4-flash` via `integrate.api.nvidia.com`
- Get a free key at [build.nvidia.com](https://build.nvidia.com) → DeepSeek V4 Flash → Get API Key

### Post-deploy checklist

- [ ] Sign up / login works
- [ ] Create a course and assignment
- [ ] Calendar shows dated assignments
- [ ] Focus timer saves a session
- [ ] Settings toggles persist
- [ ] AI assistant responds (Chat: "Explain Go vs Java")
- [ ] Mobile layout and PWA install metadata work

**Live URL:** https://studysphere-red-psi.vercel.app

## Project Structure

```
app/              # Next.js App Router pages and layouts
components/       # UI, layout, and feature components
lib/              # Supabase clients, DB queries, server actions
supabase/         # SQL schema
types/            # Shared TypeScript types
public/           # Static assets (icon, etc.)
```

## Environment Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.local.example` | Yes | Template for required env vars |
| `.env.local` | No (gitignored) | Your local secrets |

See [`PROJECT.md`](PROJECT.md) for product vision, design philosophy, and engineering standards.
