# StudySphere

Your academic command center — a premium student productivity app built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials from **Project Settings → API Keys**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-legacy-anon-key
```

### 3. Apply the database schema

Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) via the Supabase **SQL Editor**.

Full setup and verification steps are in [`PROJECT.md`](PROJECT.md#database-setup).

### 4. Start the dev server

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

## Project structure

```
app/              # Next.js App Router pages
components/       # UI and layout components
lib/              # Utilities, Supabase clients, actions
supabase/         # SQL schema
types/            # Shared TypeScript types
```

See [`PROJECT.md`](PROJECT.md) for product vision, sprint goals, and engineering standards.
