-- One-owner sync: the browser never accesses this table directly.
-- Only the Edge Function uses the server-side secret key.
create table if not exists public.training_owner_records (
  record_type text not null check (record_type in ('workout', 'settings')),
  record_key text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (record_type, record_key)
);

create index if not exists training_owner_records_updated_at_idx
  on public.training_owner_records (updated_at);

alter table public.training_owner_records enable row level security;
revoke all on table public.training_owner_records from anon, authenticated;
grant all on table public.training_owner_records to service_role;
-- Deliberately no anon/authenticated policies: direct browser access is denied.
