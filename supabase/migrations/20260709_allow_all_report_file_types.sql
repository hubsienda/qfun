-- Allow every supported QOOBIX report export type.
-- Canonical Markdown value is `md`.
-- Run this in the live Supabase database if migrations are not applied automatically.

alter table public.reports
  drop constraint if exists reports_file_type_check;

alter table public.reports
  add constraint reports_file_type_check
  check (file_type in ('docx', 'xlsx', 'rtf', 'md', 'csv', 'tsv'));
