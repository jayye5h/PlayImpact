-- Optional helper RPCs

create or replace function public.increment_charity_total(p_charity_id uuid, p_amount numeric)
returns void
language sql
security definer
set search_path = public
as $$
  update public.charities
  set total_raised = total_raised + coalesce(p_amount, 0)
  where id = p_charity_id;
$$;

revoke all on function public.increment_charity_total(uuid, numeric) from public;
grant execute on function public.increment_charity_total(uuid, numeric) to service_role;
