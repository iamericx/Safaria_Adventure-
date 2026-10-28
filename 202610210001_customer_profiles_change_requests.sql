-- Customer profiles and booking change requests for the static SAFARIYA site.
-- Apply after 202610180001_customer_bookings.sql.

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;
revoke all on public.customer_profiles from anon, authenticated;
grant select on public.customer_profiles to authenticated;
grant update (full_name) on public.customer_profiles to authenticated;
drop policy if exists "Customers read own profile" on public.customer_profiles;
create policy "Customers read own profile" on public.customer_profiles
  for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Customers update own profile" on public.customer_profiles;
create policy "Customers update own profile" on public.customer_profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.customer_profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Traveller'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_customer_profile on auth.users;
create trigger on_auth_user_created_customer_profile
  after insert on auth.users
  for each row execute procedure public.create_customer_profile();

insert into public.customer_profiles (id, full_name)
select u.id, coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'Traveller')
from auth.users u
on conflict (id) do nothing;

alter table public.bookings
  add column if not exists payment_status text not null default 'not_started'
  check (payment_status in ('not_started', 'pending', 'successful', 'failed', 'refunded'));

create table if not exists public.booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_text text not null check (char_length(trim(request_text)) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'under_review', 'completed', 'declined')),
  created_at timestamptz not null default now()
);

create index if not exists booking_change_requests_user_created_idx
  on public.booking_change_requests (user_id, created_at desc);
alter table public.booking_change_requests enable row level security;
revoke all on public.booking_change_requests from anon, authenticated;
grant select on public.booking_change_requests to authenticated;
grant insert (booking_id, user_id, request_text) on public.booking_change_requests to authenticated;
drop policy if exists "Customers read own booking change requests" on public.booking_change_requests;
create policy "Customers read own booking change requests" on public.booking_change_requests
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Customers create change requests for own bookings" on public.booking_change_requests;
create policy "Customers create change requests for own bookings" on public.booking_change_requests
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = (select auth.uid())
    )
  );
-- No customer payment writes or booking/status updates are granted by this migration.
