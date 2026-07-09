-- Log every attempted report row insert before CHECK constraints are evaluated.
-- This makes future file_type constraint failures easier to diagnose from database logs.

create or replace function public.log_report_insert_attempt()
returns trigger as $$
begin
  raise log 'QOOBIX report insert attempt: job_id=%, file_type=%, file_name=%',
    new.job_id,
    new.file_type,
    new.file_name;

  return new;
end;
$$ language plpgsql;

drop trigger if exists reports_log_insert_attempt on public.reports;

create trigger reports_log_insert_attempt
before insert on public.reports
for each row
execute function public.log_report_insert_attempt();
