-- =========================================================
-- RocketMovies — Supabase setup
-- Execute este arquivo no SQL Editor do Supabase
-- =========================================================

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

create policy "Perfis visíveis para usuários autenticados"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Usuário insere próprio perfil"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

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
    coalesce(new.raw_user_meta_data->>'role', 'user')
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
  title       text not null,
  rating      numeric(3,1) not null check (rating >= 0 and rating <= 5),
  description text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

alter table public.movies enable row level security;

create policy "Filmes visíveis para todos autenticados"
  on public.movies for select
  to authenticated
  using (true);

create policy "Autenticados podem criar filmes"
  on public.movies for insert
  to authenticated
  with check (true);

create policy "Autenticados podem editar filmes"
  on public.movies for update
  to authenticated
  using (true);

create policy "Autenticados podem deletar filmes"
  on public.movies for delete
  to authenticated
  using (true);
