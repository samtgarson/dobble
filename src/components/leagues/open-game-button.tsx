import Link from 'next/link'
import { Button } from 'rbx'
import { FC } from 'react'
import { GameEntity, LeagueEntityWithMeta } from '~/types/entities'

export const OpenGameButton: FC<{
  game: GameEntity
  league: LeagueEntityWithMeta
}> = ({ game, league }) => {
  const owner = league.members.find((m) => m.user.id == game.owner_id)?.user
  if (!owner) return null

  return (
    <Link passHref href={`/game/${game.id}`}>
      <Button size='large' color='primary' as='a'>
        Join {owner.name}&lsquo;s game
      </Button>
    </Link>
  )
}
