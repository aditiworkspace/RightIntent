drop policy if exists "admins manage catalog" on public.products;

create policy "admins insert catalog"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy "admins update catalog"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins delete catalog"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());