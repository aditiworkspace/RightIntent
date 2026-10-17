create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

revoke all on table public.admins from public, anon, authenticated;
grant select on table public.admins to authenticated;

create policy "users read own admin membership"
on public.admins for select
to authenticated
using ((select auth.uid()) = user_id);

insert into public.admins (user_id)
select p.id
from public.profiles p
where p.role = 'admin'
on conflict (user_id) do nothing;

insert into public.admins (user_id)
select u.id
from auth.users u
where lower(u.email) in (lower('brandwork420@gmail.com'), lower('jain77282@gmail.com'))
on conflict (user_id) do nothing;

update public.profiles
set role = 'customer', updated_at = now()
where role = 'admin';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;