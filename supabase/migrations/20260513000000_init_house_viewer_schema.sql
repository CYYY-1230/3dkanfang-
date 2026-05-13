create extension if not exists "pgcrypto";

create table if not exists public.communities (
  id text primary key,
  name text not null,
  district text not null,
  address text not null,
  average_price text not null,
  price_range text not null,
  intro text not null,
  map_x numeric(5, 2) not null,
  map_y numeric(5, 2) not null,
  lng numeric(9, 6) not null,
  lat numeric(8, 6) not null,
  amenities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.buildings (
  id text primary key,
  community_id text not null references public.communities(id) on delete cascade,
  name text not null,
  cover text not null,
  intro text not null,
  main_layouts text not null,
  price_range text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.layouts (
  id text primary key,
  building_id text not null references public.buildings(id) on delete cascade,
  name text not null,
  area text not null,
  rooms text not null,
  orientation text not null,
  price_range text not null,
  thumbnail text not null,
  suitable_for text not null,
  highlights text[] not null default '{}',
  floor_plan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decor_styles (
  key text primary key,
  name text not null,
  description text not null,
  wall text not null,
  floor text not null,
  accent text not null
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  layout_id text not null references public.layouts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, layout_id)
);

create index if not exists buildings_community_id_idx on public.buildings(community_id);
create index if not exists layouts_building_id_idx on public.layouts(building_id);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_layout_id_idx on public.favorites(layout_id);

grant select on public.communities to anon, authenticated;
grant select on public.buildings to anon, authenticated;
grant select on public.layouts to anon, authenticated;
grant select on public.decor_styles to anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;

alter table public.communities enable row level security;
alter table public.buildings enable row level security;
alter table public.layouts enable row level security;
alter table public.decor_styles enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "Public can read communities" on public.communities;
create policy "Public can read communities"
on public.communities for select
to anon, authenticated
using (true);

drop policy if exists "Public can read buildings" on public.buildings;
create policy "Public can read buildings"
on public.buildings for select
to anon, authenticated
using (true);

drop policy if exists "Public can read layouts" on public.layouts;
create policy "Public can read layouts"
on public.layouts for select
to anon, authenticated
using (true);

drop policy if exists "Public can read decor styles" on public.decor_styles;
create policy "Public can read decor styles"
on public.decor_styles for select
to anon, authenticated
using (true);

drop policy if exists "Users can read own favorites" on public.favorites;
create policy "Users can read own favorites"
on public.favorites for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can add own favorites" on public.favorites;
create policy "Users can add own favorites"
on public.favorites for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can remove own favorites" on public.favorites;
create policy "Users can remove own favorites"
on public.favorites for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
