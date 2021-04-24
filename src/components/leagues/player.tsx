import React, { FC } from "react"
import { medals, pluralize } from "~/src/util"
import { LeaguePlayerEntity } from "~/types/entities"
import { ListItem } from "~/components/atoms/list-item"

export const LeaguePlayer: FC<{ m: LeaguePlayerEntity, i: number }> = ({ m, i }) => (
  <ListItem
    id={m.user.id}
    content={(i < 3 ? medals[i] : '') + ' ' + m.user.name}
    label={pluralize(m.win_count ?? 0, 'win', 'wins') }
  />
)
