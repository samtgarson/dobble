drop view players;

create or replace view players as
  select games.id as game_id,
    game_memberships.hand,
    users.name,
    users.id
  from game_memberships
    join users on users.id = game_memberships.user_id
    join games on games.id = game_memberships.game_id;
