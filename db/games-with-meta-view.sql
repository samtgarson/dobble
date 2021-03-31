drop view games_with_meta;

create or replace view games_with_meta as
  select
    games.*,
    plays.card as top_card,
    plays.position as position
  from games
  left join (
    select
      distinct on (game_id) *
    from plays
    order by game_id, position desc
  ) as plays
  on plays.game_id = games.id
