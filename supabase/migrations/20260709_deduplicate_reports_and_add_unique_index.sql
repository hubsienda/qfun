-- Remove duplicate report rows and prevent future duplicates.
-- Uniqueness is defined by job_id + file_type + file_name.
-- The newest row is kept where duplicates already exist.

with ranked_reports as (
  select
    id,
    row_number() over (
      partition by job_id, file_type, file_name
      order by created_at desc, id desc
    ) as row_rank
  from public.reports
)
delete from public.reports r
using ranked_reports ranked
where r.id = ranked.id
  and ranked.row_rank > 1;

create unique index if not exists reports_job_file_type_file_name_uidx
on public.reports (job_id, file_type, file_name);
