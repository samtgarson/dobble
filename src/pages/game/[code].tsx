import { useChannel, usePresenceChannel } from '@harelpls/use-pusher'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { FinishedGame } from '~/components/finished-game'
import PreGame from '~/components/pre-game'
import Runner from '~/components/runner'
import { Wrapper } from '~/components/wrapper'
import { GlobalState } from '~/services/state'
import { User } from '~/types/api'
import { Event } from '~/types/events'
import { Game, GameStatus, Player } from '~/types/game'
import { logger } from '~/util/logger'
import { useAsyncFetch } from '~/util/use-async'
import { useClient } from '~/util/use-client'

type RenderGameProps = {
  game: Game
  user: User
  players: Record<string, Player>
}
const RenderGame: FunctionComponent<RenderGameProps> = ({ game, user, players }) => {
  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} players={players} />
    case GameStatus.Playing:
      return <Runner game={game} user={game.players[user.id]} />
    case GameStatus.Finished:
      return <FinishedGame game={game} user={user} />
    default:
      return (
        <Wrapper>
          <p>👀 Couldn&apos;t find that game</p>
        </Wrapper>
      )
  }
}

const GamePage: NextPage = () => {
  const router = useRouter()
  const code = router.query.code as string
  const { user } = GlobalState.useContainer()
  const client = useClient()

  const [game, setGame] = useState<Game>()
  const [err, setErr] = useState(false)

  const channel = useChannel(`private-${code}`)
  const { members = {} } = usePresenceChannel(`presence-${code}`)

  useEffect(() => {
    if (!channel) return
    channel.bind(Event.StateUpdated, (data: Game) => setGame(data))
    channel.bind(Event.NewGame, (data: { code: string }) => {
      logger.debug({ ...data, state: game && game.state })
      if (!game || game.state !== GameStatus.Finished) return
      router.push(`/game/${data.code}`)
    })
  }, [channel, game])

  useAsyncFetch(
    async () => {
      if (!code || !client) return
      const { data } = await client.get<Game>(`/api/games/${code}`)
      return data
    },
    g => {
      if (g) setGame(g)
      else setErr(true)
    },
    () => setErr(true),
    [client, code]
  )

  if (err) return (
    <Wrapper>
      <p>👀 Couldn&apos;t find that game</p>
    </Wrapper>
  )

  if (!user || !game) return null

  return <RenderGame game={game} user={user} players={members} />
}

export default GamePage
