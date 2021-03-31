import { formatDuration, intervalToDuration } from 'date-fns'
import * as Fathom from 'fathom-client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Title } from 'rbx'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { User } from '~/types/api'
import { GameEntityWithMeta, Players } from '~/types/entities'
import { fi } from '~/util'
import { DataClient } from '../services/data-client'
import { useAsyncFetch } from '../util/use-async'
import { Scoreboard } from './runner/scoreboard'
import { Wrapper } from './wrapper'

type FinishedGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
}

export const FinishedGame: FunctionComponent<FinishedGameProps> = ({ game, user, players }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [nextGame, setNextGame] = useState<GameEntityWithMeta>()
  const client = DataClient.useClient()
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
      const nextGameId = await client.createAnotherGame(user.id, game.id)
      router.push(`/game/${nextGameId}`)
    } catch (e) {
      if (!e) return
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    Fathom.trackGoal('OQHSDU2R', 0)
  }, [])

  useAsyncFetch(
    ({ nextId }) => client.getGame(nextId),
    setNextGame,
    null,
    { nextId: game?.next_game_id } as { nextId?: string }
  )

  if (!winner) return <Wrapper>Loading...</Wrapper>
  return (
    <Wrapper>
      <Title>
        { winner.id === user.id ? '🎉 You won! ' : `😞 ${winner.name} won ` }
        { duration && <span>(in {duration})</span> }
      </Title>
      <Scoreboard players={players} />
      <div className="button-wrapper">
        { nextGame
          ? <>
              <Link passHref href={`/game/${nextGame.id}`}>
                <Button as='a' size='medium' color="primary">{ players[nextGame.owner_id].name } started a new game.<span className='join-link has-text-weight-bold'>Join now</span></Button>
              </Link>
            </>
          : <Button color="success" onClick={newGame} state={fi(loading, 'loading')}>Start a new game</Button>
        }
      </div>
      <style jsx>{`
        span { font-weight: normal }
        .button-wrapper { margin-top: 40px }
        .join-link { margin-left: 5px; }
      `}</style>
    </Wrapper>
  )
}
