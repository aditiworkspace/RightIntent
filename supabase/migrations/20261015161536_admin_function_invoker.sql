grant select on table public.admins to anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;