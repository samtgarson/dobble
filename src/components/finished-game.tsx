import { formatDuration, intervalToDuration } from 'date-fns'
import * as Fathom from 'fathom-client'
import { Button, Title } from 'rbx'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { User } from '~/types/api'
import { GameEntityWithMeta, Players } from '~/types/entities'
import { Game } from '~/types/game'
import { fi } from '~/util'
import { useClient } from '~/util/use-client'
import { Scoreboard } from './runner/scoreboard'
import { Wrapper } from './wrapper'

type FinishedGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
}

export const FinishedGame: FunctionComponent<FinishedGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const client = useClient()
  const winner = useMemo(() => game.winner_id && players[game.winner_id], [game])
  const duration  = useMemo(() => {
    if (!game.started_at || !game.finished_at) return

      const duration = intervalToDuration({ start: game.started_at, end: game.finished_at })
      return formatDuration(duration, { format: ['hours', 'minutes', 'seconds'] })
  }, [game])

  const newGame = useCallback(async () => {
    if (!client) return
    setLoading(true)
    try {
      await client.post<Game>(`/api/games?previousGame=${game.id}`)
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
      <Scoreboard players={players} />
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
