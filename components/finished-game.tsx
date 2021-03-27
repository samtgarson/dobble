import React, { FunctionComponent, useMemo, useState, useCallback, useEffect } from 'react'
import { Game } from '~/types/game'
import { User } from '~/types/api'
import { Wrapper } from './wrapper'
import { Title, Button } from 'rbx'
import { Scoreboard } from './runner/scoreboard'
import { getTimeLeft, fi } from '~/util'
import { useClient } from '~/util/use-client'
import * as Fathom from 'fathom-client'

type FinishedGameProps = {
  game: Game
  user: User
}

export const FinishedGame: FunctionComponent<FinishedGameProps> = ({ game, user }) => {
  const [loading, setLoading] = useState(false)
  const client = useClient()
  const winner = useMemo(() => game.winner && game.players[game.winner], [game])
  const duration  = useMemo(() => {
    if (!game.startedAt) return

    const seconds = Math.abs(getTimeLeft(game.startedAt, game.finishedAt))
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds - (minutes * 60)
    return `${minutes}m ${remainder}s`
  }, [game])

  const newGame = useCallback(async () => {
    if (!client) return
    setLoading(true)
    try {
      await client.post<Game>(`/api/games?previousGame=${game.code}`)
    } catch (e) {
      if (!e) return
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    Fathom.trackGoal('OQHSDU2R', 0)
  }, [])

  if (!winner) return <Wrapper>Loading...</Wrapper>
  return (
    <Wrapper>
      <Title>
        { winner.id === user.id ? '🎉 You won! ' : `😞 ${winner.name} won ` }
        { duration && <span>(in {duration})</span> }
      </Title>
      <Scoreboard players={Object.values(game.players)} />
      <div className="button-wrapper">
        <Button color="success" onClick={newGame} state={fi(loading, 'loading')}>Start a new game</Button>
      </div>
      <style jsx>{`
        span { font-weight: normal }
        .button-wrapper { margin-top: 40px }
      `}</style>
    </Wrapper>
  )
}
