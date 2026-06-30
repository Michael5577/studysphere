# 🎓 StudySphere

> **Your Academic Command Center**

Version: 1.0 MVP
Status: In Development
Project Owner: Michael Serbeh

---

# Product Vision

StudySphere is a modern, production-ready SaaS web application designed to help college and university students organize every aspect of their academic life.

Rather than being just another assignment tracker, StudySphere should become a student's central academic workspace where they can manage courses, assignments, deadlines, study sessions, and focus time through a clean, intuitive, and premium user experience.

The application should feel polished enough that a user could realistically choose it over existing productivity tools.

---

# Mission

Build a beautiful, fast, intuitive platform that helps students stay organized, reduce stress, and improve academic performance.

---

# Design Philosophy

StudySphere should **NOT** feel like:

* a school project
* a basic CRUD application
* a Bootstrap dashboard
* a generic admin template

Instead it should feel like a real startup product.

Inspired by:

* Linear
* Notion
* Apple
* Vercel
* MasterClass
* Skillshare
* Arc Browser

Design principles:

* Minimal
* Elegant
* Professional
* Calm
* Premium
* Modern
* Spacious
* Responsive
* Accessible

Every screen should have clear visual hierarchy and generous whitespace.

---

# Target Users

Primary Users

* College students
* University students
* Graduate students

Secondary Users

* Self learners
* Bootcamp students

---

# Core MVP

Users should be able to:

* Create an account
* Log in securely
* View a personalized dashboard
* Create and manage courses
* Create and manage assignments
* Track assignment progress
* Use a Pomodoro focus timer
* View productivity statistics
* Edit profile/settings

---

# Future Features

These are intentionally **NOT** part of MVP:

* AI Study Planner
* AI Assignment Breakdown
* AI Flashcard Generator
* AI Quiz Generator
* Google Calendar Sync
* Discord Integration
* Study Groups
* Messaging
* Real-time Collaboration
* Mobile App

---

# Technology Stack

Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

Backend

* Supabase

Database

* PostgreSQL

Authentication

* Supabase Auth

Deployment

* Vercel

Icons

* Lucide React

Animations

* Framer Motion

Forms

* React Hook Form

Validation

* Zod

---

# UI Guidelines

Use:

* Rounded cards
* Soft shadows
* Modern typography
* Large spacing
* Clean dashboards
* Smooth hover effects
* Beautiful loading states
* Elegant empty states

Avoid:

* Clutter
* Harsh colors
* Tiny buttons
* Bootstrap look
* Generic admin dashboards

---

# Engineering Principles

Always write:

* Clean code
* Modular components
* Reusable UI
* Strong TypeScript types
* Proper error handling
* Responsive layouts
* Accessible components

Follow:

* DRY
* SOLID
* KISS

Never:

* Leave placeholder code
* Build huge components
* Ignore mobile responsiveness
* Duplicate code

---

# Folder Structure

app/
components/
components/ui/
components/layout/
components/dashboard/
components/courses/
components/assignments/
components/focus/
lib/
hooks/
types/
utils/
public/

---

# Git Workflow

Commit after every meaningful milestone.

Example commits:

* feat: initialize StudySphere
* feat: add authentication
* feat: build landing page
* feat: implement dashboard
* feat: add courses CRUD
* feat: add assignments CRUD
* feat: deploy production build

---

# AI Assistant Instructions

Before implementing any feature:

1. Read this PROJECT.md file completely.
2. Treat this file as the project's source of truth.
3. Explain your implementation plan before writing code.
4. Build only the requested feature.
5. Do not modify unrelated files.
6. Create reusable components whenever possible.
7. Do not overengineer solutions.
8. Keep the code production-ready.

---

# Current Sprint

Sprint 4 — Real Data + CRUD

Objectives:

* Replace placeholder app data with authenticated Supabase reads
* Implement MVP CRUD for courses and assignments
* Wire dashboard, profile, and settings to real data
* Add server actions with validation and path revalidation

Success Criteria:

* Courses and assignments are fully CRUD-able from the UI
* Archived courses are hidden from the main courses list
* Dashboard shows real stats and due-soon assignments
* Profile and settings read/write `profiles` and `user_preferences`
* Build and lint pass with no placeholder arrays on wired pages
* Ready for Sprint 5 (focus timer writes, calendar, etc.)

---

# Database Setup

StudySphere stores user-owned data in Supabase PostgreSQL.

## Apply the schema

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Click **New query**.
4. Copy the full contents of [`supabase/schema.sql`](supabase/schema.sql).
5. Paste into the editor and click **Run**.
6. Confirm success with no errors.

## Verify tables

In **Table Editor**, confirm these tables exist:

* `profiles`
* `user_preferences`
* `courses`
* `assignments`
* `study_sessions`

Each table should show **RLS enabled**.

## Verify new user bootstrap

1. Sign up a new test user in the app, or create one in **Authentication → Users**.
2. Confirm rows were created in:
   * `profiles`
   * `user_preferences`

Existing users created before the schema was applied will need profile rows inserted manually or via a one-time backfill.

## Local environment

Ensure `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-legacy-anon-or-publishable-key
```

Use the legacy anon key (`eyJ...`) if auth requests fail with the publishable key.

---

# Previous Sprints

Sprint 2 — Authentication

Objectives:

* Supabase login and signup
* Protected app routes
* Logout and session handling

Sprint 1 — Foundation

Objectives:

* Build design system
* Create landing page
* Create reusable UI components
* Set up project structure
* Prepare for authentication

---

# Long-Term Goal

StudySphere should become the strongest project in this portfolio.

By the end of development, it should demonstrate:

* Modern frontend engineering
* Authentication
* Database design
* Protected routes
* Responsive UI
* Clean architecture
* Production deployment
* Professional design
* Strong engineering practices

The finished application should be something that recruiters, engineers, and hiring managers can sign into, explore, and recognize as a thoughtfully engineered, production-quality product rather than a classroom assignment.
