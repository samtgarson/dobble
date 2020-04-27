import React, { FunctionComponent, useMemo } from 'react'
import { Game } from '~/types/game'
import { User } from '~/types/api'
import { Wrapper } from './util/wrapper'
import { Title } from 'rbx'
import { Scoreboard } from './runner/scoreboard'
import { getTimeLeft } from '~/util'

type FinishedGameProps = {
  game: Game
  user: User
}

export const FinishedGame: FunctionComponent<FinishedGameProps> = ({ game, user }) => {
  const winner = useMemo(() => game.winner && game.players[game.winner], [game])
  const duration  = useMemo(() => {
    if (!game.startAt) return

    const seconds = getTimeLeft(game.startAt)
    const minutes = Math.floor(seconds / 60)
    console.log(getTimeLeft(game.startAt))
    const remainder = seconds - (minutes * 60)
    return `${minutes}m ${remainder}s`
  }, [game])

  if (!winner) return <Wrapper>Loading...</Wrapper>
  return (
    <Wrapper>
      <Title>
        { winner.id === user.id ? '🎉 You won!' : `😞 ${winner.name} won` }
        { duration && <span>(in {duration})</span> }
      </Title>
      <Scoreboard players={Object.values(game.players)} />
      <style jsx>{`
        span { font-weight: normal }
      `}</style>
    </Wrapper>
  )
}
