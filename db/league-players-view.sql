drop view league_players;

create or replace view league_players as
  select
    league_memberships.id as id,
    league_memberships.league_id as league_id,
    sum(jsonb_array_length(players.hand)) as cards_left,
    row_to_json(users) as user,
    row_to_json(league_memberships) as membership,
    sum(case
      when games.winner_id = league_memberships.user_id then 1
      else 0
    end) as win_count
  from league_memberships
    join users on users.id = league_memberships.user_id
    join leagues on league_memberships.league_id = leagues.id
    left outer join games on games.league_id = leagues.id
    left outer join players
      on games.id = players.game_id
      and league_memberships.user_id = players.id
  group by league_memberships.id, users.id;
