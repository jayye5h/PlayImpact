-- PlayImpact schema (run in Supabase SQL editor)

-- Extensions
create extension if not exists pgcrypto;

-- Charities
create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  total_raised numeric not null default 0,
  created_at timestamptz not null default now()
);

-- User profile (linked to auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  plan_type text,
  is_active boolean not null default false,
  expiry_date date,
  charity_id uuid references public.charities (id) on delete set null,
  charity_percentage int not null default 10 check (charity_percentage between 0 and 100),
  created_at timestamptz not null default now()
);

-- Scores (max 5 per user enforced by add_score function)
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  score int not null check (score between 1 and 45),
  date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);
create index if not exists scores_user_date_idx on public.scores (user_id, date desc);

-- Draws (monthly draw results)
create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_date date not null unique,
  numbers int[] not null,
  type text not null default 'random',
  created_at timestamptz not null default now()
);

-- Winners (only stored when match_count >= 3)
create table if not exists public.winners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  draw_id uuid not null references public.draws (id) on delete cascade,
  match_count int not null check (match_count between 0 and 5),
  prize numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','rejected','paid')),
  proof_url text,
  created_at timestamptz not null default now(),
  unique (user_id, draw_id)
);
create index if not exists winners_draw_idx on public.winners (draw_id);
create index if not exists winners_user_idx on public.winners (user_id);

-- Create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.winners enable row level security;
alter table public.charities enable row level security;

-- Users can read/update their own profile
create policy if not exists "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy if not exists "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Scores: users manage their own
create policy if not exists "scores_select_own" on public.scores
  for select using (auth.uid() = user_id);

create policy if not exists "scores_insert_own" on public.scores
  for insert with check (auth.uid() = user_id);

create policy if not exists "scores_delete_own" on public.scores
  for delete using (auth.uid() = user_id);

-- Draws: authenticated users can view
create policy if not exists "draws_select_auth" on public.draws
  for select using (auth.role() = 'authenticated');

-- Winners: users can view their own
create policy if not exists "winners_select_own" on public.winners
  for select using (auth.uid() = user_id);

-- Charities: authenticated users can view
create policy if not exists "charities_select_auth" on public.charities
  for select using (auth.role() = 'authenticated');

-- Atomic score add (enforces max 5 + unique date + replace oldest)
create or replace function public.add_score(p_score int, p_date date)
returns public.scores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_count int;
  v_inserted public.scores;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  if p_score < 1 or p_score > 45 then
    raise exception 'score must be between 1 and 45';
  end if;

  if exists (
    select 1 from public.scores s
    where s.user_id = v_user and s.date = p_date
  ) then
    raise exception 'score already exists for this date';
  end if;

  select count(*) into v_count from public.scores where user_id = v_user;
  if v_count >= 5 then
    delete from public.scores
    where id = (
      select id from public.scores
      where user_id = v_user
      order by date asc, created_at asc
      limit 1
    );
  end if;

  insert into public.scores (user_id, score, date)
  values (v_user, p_score, p_date)
  returning * into v_inserted;

  return v_inserted;
end;
$$;

revoke all on function public.add_score(int, date) from public;
grant execute on function public.add_score(int, date) to authenticated;

-- Charity total increment helper (used by admin publish draw)
create or replace function public.increment_charity_total(p_charity_id uuid, p_amount numeric)
returns void
language sql
security definer
set search_path = public
as $$
  update public.charities
  set total_raised = total_raised + coalesce(p_amount, 0)
  where id = p_charity_id;
$$;

revoke all on function public.increment_charity_total(uuid, numeric) from public;
grant execute on function public.increment_charity_total(uuid, numeric) to service_role;
