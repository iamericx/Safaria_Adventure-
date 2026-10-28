-- Customer booking requests for the static SAFARIYA site.
-- Run in the Supabase SQL Editor. Customers can only read their own rows.
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id text not null check (package_id in ('serengeti-coast', 'northern-wild', 'above-clouds')),
  start_date date,
  end_date date,
  travellers smallint not null check (travellers between 1 and 20),
  phone text check (phone is null or char_length(phone) <= 40),
  special_requests text check (special_requests is null or char_length(special_requests) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'under_review', 'needs_information', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint booking_dates_ordered check (start_date is null or end_date is null or end_date >= start_date),
  constraint booking_start_not_past check (start_date is null or start_date >= current_date)
);

create index if not exists bookings_user_created_idx on public.bookings (user_id, created_at desc);
alter table public.bookings enable row level security;
revoke all on public.bookings from anon, authenticated;
grant select on public.bookings to authenticated;
-- Column grants prevent customers from choosing a status or created_at value.
grant insert (user_id, package_id, start_date, end_date, travellers, phone, special_requests)
  on public.bookings to authenticated;
drop policy if exists "Customers read own booking requests" on public.bookings;
create policy "Customers read own booking requests" on public.bookings
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Customers create own booking requests" on public.bookings;
create policy "Customers create own booking requests" on public.bookings
  for insert to authenticated with check ((select auth.uid()) = user_id);
-- There are intentionally no customer update/delete policies. Status changes must be made
-- through a separately authorized staff workflow, which is not part of this static site.
