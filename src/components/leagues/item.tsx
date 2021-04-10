import React, { FC } from "react"
import { medals, pluralize } from "~/src/util"
import { LeaguePlayer } from "~/types/entities"

export const LeagueItem: FC<{ m: LeaguePlayer, i: number }> = ({ m, i }) => (
  <li
    className="is-flex is-justify-content-space-between is-align-items-center mb-3"
    key={m.membership.id}
  >
    <span>
      { i < 3 && medals[i] }
      { m.user.name }
    </span>
    <span>
    { m.cards_left && pluralize(m.cards_left, 'card', 'cards') + ' left, ' }
    { pluralize(m.win_count ?? 0, 'win', 'wins') } </span>
  </li>
)

