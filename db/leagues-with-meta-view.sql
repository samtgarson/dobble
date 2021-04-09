create or replace view leagues_with_meta as
	select
		leagues.*,
		count(games.id) as game_count
	from leagues
	left outer join games on leagues.id = games.league_id and games.finished_at is not null
	group by leagues.id
	order by leagues.created_at desc;

