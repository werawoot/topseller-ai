-- =============================================
-- TopSeller AI — Initial Schema
-- รันไฟล์นี้ใน Supabase SQL Editor
-- =============================================

-- ── profiles ──────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  is_pro      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── projects ──────────────────────────────────
create table public.projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  title             text not null default 'โปรเจกต์ใหม่',
  original_image_path  text,         -- path ใน storage bucket
  edited_image_path    text,         -- path ใน storage bucket
  template_id       text,
  background_id     text,
  caption           text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "users can read own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ── storage buckets ───────────────────────────
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', false);

-- เฉพาะ owner เท่านั้นที่ upload/read/delete ได้
create policy "users can upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'project-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can read own images"
  on storage.objects for select
  using (
    bucket_id = 'project-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'project-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
