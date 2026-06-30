-- StudySphere MVP schema
-- Run this file once in Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.assignment_status as enum ('todo', 'in_progress', 'done');

create type public.assignment_priority as enum ('low', 'medium', 'high');

create type public.course_color_key as enum (
  'indigo',
  'violet',
  'slate',
  'amber',
  'rose'
);

create type public.session_type as enum ('focus', 'short_break', 'long_break');

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  major text,
  university text,
  year_level text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_full_name_length check (
    full_name is null or char_length(full_name) <= 120
  ),
  constraint profiles_major_length check (
    major is null or char_length(major) <= 120
  ),
  constraint profiles_university_length check (
    university is null or char_length(university) <= 120
  ),
  constraint profiles_year_level_length check (
    year_level is null or char_length(year_level) <= 60
  )
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- user_preferences
-- ---------------------------------------------------------------------------

create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  work_duration_minutes integer not null default 25,
  break_duration_minutes integer not null default 5,
  long_break_duration_minutes integer not null default 15,
  compact_mode boolean not null default false,
  show_completed_assignments boolean not null default true,
  assignment_reminders boolean not null default true,
  daily_summary_email boolean not null default false,
  focus_session_alerts boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_preferences_work_duration_range check (
    work_duration_minutes between 1 and 180
  ),
  constraint user_preferences_break_duration_range check (
    break_duration_minutes between 1 and 60
  ),
  constraint user_preferences_long_break_duration_range check (
    long_break_duration_minutes between 1 and 120
  )
);

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null,
  name text not null,
  instructor text,
  color_key public.course_color_key not null default 'indigo',
  semester text not null default 'Current',
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint courses_code_not_blank check (char_length(trim(code)) > 0),
  constraint courses_code_length check (char_length(code) <= 20),
  constraint courses_name_not_blank check (char_length(trim(name)) > 0),
  constraint courses_name_length check (char_length(name) <= 200),
  constraint courses_instructor_length check (
    instructor is null or char_length(instructor) <= 120
  ),
  constraint courses_semester_length check (char_length(semester) <= 60),
  constraint courses_user_code_semester_unique unique (user_id, code, semester)
);

create index courses_user_id_idx on public.courses (user_id);
create index courses_user_id_is_archived_idx on public.courses (user_id, is_archived);

create trigger courses_set_updated_at
before update on public.courses
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- assignments
-- ---------------------------------------------------------------------------

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  status public.assignment_status not null default 'todo',
  priority public.assignment_priority not null default 'medium',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint assignments_title_not_blank check (char_length(trim(title)) > 0),
  constraint assignments_title_length check (char_length(title) <= 300),
  constraint assignments_description_length check (
    description is null or char_length(description) <= 5000
  ),
  constraint assignments_completed_at_consistency check (
    (status = 'done' and completed_at is not null)
    or (status <> 'done' and completed_at is null)
  )
);

create index assignments_user_id_idx on public.assignments (user_id);
create index assignments_course_id_idx on public.assignments (course_id);
create index assignments_user_id_due_at_idx on public.assignments (user_id, due_at);
create index assignments_user_id_status_idx on public.assignments (user_id, status);
create index assignments_user_id_open_due_at_idx
  on public.assignments (user_id, due_at)
  where status <> 'done';

create trigger assignments_set_updated_at
before update on public.assignments
for each row
execute function public.set_updated_at();

create or replace function public.enforce_assignment_course_owner()
returns trigger
language plpgsql
as $$
declare
  course_owner_id uuid;
begin
  select user_id
  into course_owner_id
  from public.courses
  where id = new.course_id;

  if course_owner_id is null then
    raise exception 'Course not found for assignment';
  end if;

  if course_owner_id <> new.user_id then
    raise exception 'Assignment user_id must match course owner';
  end if;

  return new;
end;
$$;

create trigger assignments_enforce_course_owner
before insert or update on public.assignments
for each row
execute function public.enforce_assignment_course_owner();

-- ---------------------------------------------------------------------------
-- study_sessions
-- ---------------------------------------------------------------------------

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  session_type public.session_type not null default 'focus',
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint study_sessions_duration_seconds_nonnegative check (
    duration_seconds >= 0
  ),
  constraint study_sessions_time_order check (
    ended_at is null or ended_at >= started_at
  )
);

create index study_sessions_user_id_started_at_idx
  on public.study_sessions (user_id, started_at desc);

create index study_sessions_course_id_idx
  on public.study_sessions (course_id)
  where course_id is not null;

create trigger study_sessions_set_updated_at
before update on public.study_sessions
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New user bootstrap
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.study_sessions enable row level security;

-- profiles
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (id = auth.uid());

-- user_preferences
create policy "user_preferences_select_own"
on public.user_preferences
for select
to authenticated
using (user_id = auth.uid());

create policy "user_preferences_insert_own"
on public.user_preferences
for insert
to authenticated
with check (user_id = auth.uid());

create policy "user_preferences_update_own"
on public.user_preferences
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user_preferences_delete_own"
on public.user_preferences
for delete
to authenticated
using (user_id = auth.uid());

-- courses
create policy "courses_select_own"
on public.courses
for select
to authenticated
using (user_id = auth.uid());

create policy "courses_insert_own"
on public.courses
for insert
to authenticated
with check (user_id = auth.uid());

create policy "courses_update_own"
on public.courses
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "courses_delete_own"
on public.courses
for delete
to authenticated
using (user_id = auth.uid());

-- assignments
create policy "assignments_select_own"
on public.assignments
for select
to authenticated
using (user_id = auth.uid());

create policy "assignments_insert_own"
on public.assignments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "assignments_update_own"
on public.assignments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "assignments_delete_own"
on public.assignments
for delete
to authenticated
using (user_id = auth.uid());

-- study_sessions
create policy "study_sessions_select_own"
on public.study_sessions
for select
to authenticated
using (user_id = auth.uid());

create policy "study_sessions_insert_own"
on public.study_sessions
for insert
to authenticated
with check (user_id = auth.uid());

create policy "study_sessions_update_own"
on public.study_sessions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "study_sessions_delete_own"
on public.study_sessions
for delete
to authenticated
using (user_id = auth.uid());
