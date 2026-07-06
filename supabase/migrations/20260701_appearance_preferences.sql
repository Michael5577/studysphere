-- Appearance preferences for theme customization
alter table public.user_preferences
  add column if not exists color_scheme text not null default 'system'
    check (color_scheme in ('light', 'dark', 'system'));

alter table public.user_preferences
  add column if not exists background_style text not null default 'vivid'
    check (background_style in ('vivid', 'organic', 'minimal', 'aurora'));
