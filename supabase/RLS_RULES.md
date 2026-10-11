# Supabase RLS Rules

These rules apply to every future Supabase table, storage bucket, view, or RPC that is added to Aditi.

1. Enable Row Level Security in the same migration that creates the object.
2. Add explicit `select`, `insert`, `update`, and `delete` policies only for the intended actors.
3. Scope customer data to `auth.uid()` or a server-verified ownership relationship.
4. Keep admin policies separate and require a server-controlled admin role.
5. Never rely on frontend route hiding as authorization.
6. Review policies with the Supabase MCP before applying a migration.
7. Do not use the service-role key in browser code; it bypasses RLS.

## Table template

```sql
create table public.example (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.example enable row level security;

create policy "users read own example rows"
on public.example for select
to authenticated
using (user_id = auth.uid());

create policy "users insert own example rows"
on public.example for insert
to authenticated
with check (user_id = auth.uid());
```

Every policy should be tested with anonymous, authenticated customer, and admin identities before deployment.
