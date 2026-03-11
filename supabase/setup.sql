-- =========================================================
-- RocketMovies — Supabase setup
-- Execute este arquivo no SQL Editor do Supabase
-- =========================================================

create extension if not exists pgcrypto;

-- ── Tabela de perfis ────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text not null,
  email      text not null,
  avatar_url text not null default '',
  role       text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Perfis visíveis para usuários autenticados" on public.profiles;
drop policy if exists "Usuário vê próprio perfil ou admin" on public.profiles;
drop policy if exists "Usuário atualiza próprio perfil" on public.profiles;
drop policy if exists "Usuário atualiza próprio perfil ou admin" on public.profiles;
drop policy if exists "Usuário insere próprio perfil" on public.profiles;

create policy "Usuário vê próprio perfil ou admin"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "Usuário atualiza próprio perfil ou admin"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "Usuário insere próprio perfil"
  on public.profiles for insert
  to authenticated
  with check (
    (auth.uid() = id and role = 'user')
    or public.is_admin()
  );

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Somente administradores podem alterar o papel do usuário.';
    end if;

    if new.id is distinct from old.id then
      raise exception 'Não é permitido alterar o identificador do perfil.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists before_profile_update on public.profiles;
create trigger before_profile_update
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- Trigger: cria perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatarUrl', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Tabela de filmes ─────────────────────────────────────
create table if not exists public.movies (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade default auth.uid(),
  title       text not null,
  rating      numeric(3,1) not null check (rating >= 0 and rating <= 5),
  description text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

alter table public.movies add column if not exists user_id uuid references auth.users on delete cascade;
alter table public.movies alter column user_id set default auth.uid();

alter table public.movies enable row level security;

drop policy if exists "Filmes visíveis para todos autenticados" on public.movies;
drop policy if exists "Autenticados podem criar filmes" on public.movies;
drop policy if exists "Autenticados podem editar filmes" on public.movies;
drop policy if exists "Autenticados podem deletar filmes" on public.movies;
drop policy if exists "Usuário vê próprios filmes ou admin" on public.movies;
drop policy if exists "Usuário cria próprios filmes ou admin" on public.movies;
drop policy if exists "Usuário edita próprios filmes ou admin" on public.movies;
drop policy if exists "Usuário deleta próprios filmes ou admin" on public.movies;

create policy "Usuário vê próprios filmes ou admin"
  on public.movies for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Usuário cria próprios filmes ou admin"
  on public.movies for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

create policy "Usuário edita próprios filmes ou admin"
  on public.movies for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "Usuário deleta próprios filmes ou admin"
  on public.movies for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());
