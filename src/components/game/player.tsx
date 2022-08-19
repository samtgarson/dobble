import { FC } from 'react'
import { medals, pluralize } from '~/src/util'
import { Player } from '~/types/game'
import { ListItem } from '../atoms/list-item'

export const PlayerListItem: FC<{ player: Player; i: number }> = ({
  player,
  i
}) => (
  <ListItem
    id={player.id}
    content={(i < 3 ? medals[i] : '') + ' ' + player.name}
    label={pluralize(player.hand.length ?? 0, 'card left', 'cards left')}
  />
)
