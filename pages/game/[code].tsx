import Router, { useRouter } from 'next/router'
import React, { FunctionComponent, useState, useEffect } from 'react'
import { GameStatus, Game } from '~/types/game'
import { Event } from '~/types/events'
import { GlobalState } from '~/services/state'
import Runner from '~/components/runner'
import PreGame from '~/components/pre-game'
import { User } from '~/types/api'
import { useAsyncFetch } from '~/util/use-async'
import { Wrapper } from '~/components/wrapper'
import { useChannel, usePresenceChannel } from '@harelpls/use-pusher'
import { useClient } from '~/util/use-client'
import { FinishedGame } from '~/components/finished-game'
import { logger } from '~/util/logger'

type RenderGameProps = {
  game: Game
  user: User
  players: { [id: string]: any }
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

const GamePage = () => {
  const router = useRouter()
  const code = router.query.code as string | undefined
  const { user } = GlobalState.useContainer()
  const client = useClient()

  const [game, setGame] = useState<Game>()
  const [err, setErr] = useState(false)

  const channel = useChannel(`private-${code}`)
  const { members } = usePresenceChannel(`presence-${code}`)

  useEffect(() => {
    if (!channel) return
    channel.bind(Event.StateUpdated, (data: Game) => setGame(data))
    channel.bind(Event.NewGame, (data: { code: string }) => {
      logger.debug({ ...data, state: game && game.state })
      if (!game || game.state !== GameStatus.Finished) return
      Router.push('/game/[code]', `/game/${data.code}`)
    })
  }, [channel])

  useAsyncFetch(
    async () => {
      const { data } = await client!.get<Game>(`/api/games/${code!}`)
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
