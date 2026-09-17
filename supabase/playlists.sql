begin;
create table if not exists public.playlists (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(trim(name)) between 1 and 80),
 songs jsonb not null default '[]'::jsonb check (jsonb_typeof(songs) = 'array'),
 legacy_favorites boolean not null default false,
 created_at timestamptz not null default now()
);
create unique index if not exists playlists_legacy_owner on public.playlists(user_id) where legacy_favorites;
alter table public.playlists enable row level security;
create policy "Own playlists read" on public.playlists for select to authenticated using (auth.uid() = user_id);
create policy "Own playlists create" on public.playlists for insert to authenticated with check (auth.uid() = user_id);
create policy "Own playlists edit" on public.playlists for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own playlists delete" on public.playlists for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.playlists to authenticated;
insert into public.playlists(user_id,name,songs,legacy_favorites)
select user_id,'Yêu thích',jsonb_agg(song order by created_at,song_id),true
from public.favorites group by user_id
on conflict (user_id) where legacy_favorites do nothing;
commit;
