-- ============================================================
-- MMUST Market - Supabase Schema
-- Run this in: Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. CREATE TABLES FIRST
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text,
  name text,
  pin_set boolean default false,
  pin text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('product', 'house')),
  title text not null,
  price numeric not null,
  category text not null,
  location text not null,
  phone text not null,
  description text,
  images text[] default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.admins (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. ENABLE RLS
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.app_settings enable row level security;
alter table public.admins enable row level security;

-- 3. POLICIES (after all tables exist)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view approved listings" on public.listings for select using (status = 'approved');
create policy "Users can view own listings" on public.listings for select using (auth.uid() = user_id);
create policy "Users can insert own listings" on public.listings for insert with check (auth.uid() = user_id);
create policy "Users can update own pending listings" on public.listings for update using (auth.uid() = user_id and status = 'pending');
create policy "Admins can update any listing" on public.listings for all using (auth.uid() in (select id from public.admins));

create policy "Admins can view admins" on public.admins for select using (auth.uid() in (select id from public.admins));

-- 4. APP SETTINGS SEED
insert into public.app_settings (key, value) values
  ('maintenance_mode', 'false'),
  ('auto_approve', 'false'),
  ('app_name', 'MMUST Market')
on conflict (key) do update set value = excluded.value;

-- 5. FUNCTIONS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone, name)
  values (new.id, new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
