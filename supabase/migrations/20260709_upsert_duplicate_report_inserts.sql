-- Convert duplicate report insert attempts into updates instead of failing or creating duplicates.
-- This protects repeated generation of the same job/output file.
-- It works with the uniqueness definition: job_id + file_type + file_name.

create or replace function public.upsert_duplicate_report_insert()
returns trigger as $$
begin
  raise log 'QOOBIX report insert attempt: job_id=%, file_type=%, file_name=%',
    new.job_id,
    new.file_type,
    new.file_name;

  if exists (
    select 1
    from public.reports existing
    where existing.job_id = new.job_id
      and existing.file_type = new.file_type
      and existing.file_name = new.file_name
  ) then
    update public.reports existing
    set
      file_url = new.file_url,
      storage_path = new.storage_path,
      expires_at = new.expires_at
    where existing.job_id = new.job_id
      and existing.file_type = new.file_type
      and existing.file_name = new.file_name;

    raise log 'QOOBIX duplicate report insert converted to update: job_id=%, file_type=%, file_name=%',
      new.job_id,
      new.file_type,
      new.file_name;

    return null;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists reports_upsert_duplicate_insert on public.reports;

create trigger reports_upsert_duplicate_insert
before insert on public.reports
for each row
execute function public.upsert_duplicate_report_insert();
