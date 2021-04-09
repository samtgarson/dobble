drop function get_leagues;

create or replace function get_leagues (
  req_user_id uuid
)
	returns setof leagues_with_meta
	language plpgsql
as $$
begin
	return query
		select
			leagues_with_meta.*
		from
			leagues_with_meta
    join league_memberships on league_memberships.league_id = leagues_with_meta.id
		where
			league_memberships.user_id = req_user_id;
end;$$;

