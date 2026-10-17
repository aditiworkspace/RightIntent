alter table public.admins
add column email text;

update public.admins a
set email = lower(u.email)
from auth.users u
where u.id = a.user_id;

alter table public.admins
alter column email set not null;

create unique index admins_email_lower_unique
on public.admins (lower(email));

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.link_admin_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email := lower(btrim(new.email));

  select u.id into new.user_id
  from auth.users u
  where lower(u.email) = new.email
    and u.email_confirmed_at is not null;

  if new.user_id is null then
    raise exception using
      errcode = '23503',
      message = 'Admin email must match an existing confirmed Supabase Auth user';
  end if;

  return new;
end;
$$;

revoke all on function private.link_admin_email() from public, anon, authenticated;

create trigger admins_link_email
before insert or update of email on public.admins
for each row execute function private.link_admin_email();

revoke select on table public.admins from anon, authenticated;
grant select (user_id) on table public.admins to anon, authenticated;