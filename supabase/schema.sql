create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  sector text not null,
  description text,
  website text,
  products_services text,
  target_countries text[] not null default '{}',
  target_customer_types text[] not null default '{}',
  target_channels text[] not null default '{}',
  known_competitors text,
  known_representatives text,
  preferred_language text not null default 'English',
  available_report_types text[] not null default array['docx', 'xlsx'],
  file_retention_days integer not null default 30,
  is_active boolean not null default true
);

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  code text not null unique,
  label text,
  expires_at timestamptz,
  is_active boolean not null default true,
  last_used_at timestamptz
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  status text not null default 'received',
  request_metadata jsonb not null,
  result_token text not null unique,
  error_message text,
  constraint jobs_status_check check (
    status in ('received', 'processing', 'generating_outputs', 'ready', 'failed')
  )
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  file_type text not null,
  file_name text not null,
  file_url text not null,
  storage_path text,
  expires_at timestamptz,
  constraint reports_file_type_check check (
    file_type in ('docx', 'xlsx', 'csv', 'rtf', 'md')
  )
);

alter table public.reports drop constraint if exists reports_file_type_check;
alter table public.reports add constraint reports_file_type_check check (
  file_type in ('docx', 'xlsx', 'csv', 'rtf', 'md')
);

create table if not exists public.job_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid references public.jobs(id) on delete set null,
  level text not null,
  message text not null,
  details jsonb,
  constraint job_logs_level_check check (
    level in ('info', 'warning', 'error')
  )
);

create index if not exists clients_slug_idx on public.clients(slug);
create index if not exists access_codes_code_idx on public.access_codes(code);
create index if not exists access_codes_client_id_idx on public.access_codes(client_id);
create index if not exists jobs_client_id_idx on public.jobs(client_id);
create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_result_token_idx on public.jobs(result_token);
create index if not exists reports_job_id_idx on public.reports(job_id);
create index if not exists job_logs_job_id_idx on public.job_logs(job_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row
execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.access_codes enable row level security;
alter table public.jobs enable row level security;
alter table public.reports enable row level security;
alter table public.job_logs enable row level security;

drop policy if exists "Service role can manage clients" on public.clients;
create policy "Service role can manage clients"
on public.clients
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage access codes" on public.access_codes;
create policy "Service role can manage access codes"
on public.access_codes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage jobs" on public.jobs;
create policy "Service role can manage jobs"
on public.jobs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage reports" on public.reports;
create policy "Service role can manage reports"
on public.reports
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage job logs" on public.job_logs;
create policy "Service role can manage job logs"
on public.job_logs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public)
values ('qoobix-reports', 'qoobix-reports', false)
on conflict (id) do nothing;

drop policy if exists "Service role can manage QOOBIX report files" on storage.objects;
create policy "Service role can manage QOOBIX report files"
on storage.objects
for all
using (
  bucket_id = 'qoobix-reports'
  and auth.role() = 'service_role'
)
with check (
  bucket_id = 'qoobix-reports'
  and auth.role() = 'service_role'
);
