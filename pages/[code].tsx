import { useRouter } from 'next/router'
import React, { FunctionComponent, useState, useEffect } from 'react'
import { GameStatus, Game } from '~/types/game'
import { Event } from '~/types/events'
import { GlobalState } from '~/services/state'
import Runner from '~/components/runner'
import PreGame from '~/components/pre-game'
import { User } from '~/types/api'
import { Title, Button } from 'rbx'
import Link from 'next/link'
import { useAsyncFetch } from '~/util/use-async'
import { Wrapper } from '~/components/util/wrapper'
import { useChannel, usePresenceChannel } from '@harelpls/use-pusher'
import { useClient } from '~/util/use-client'

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
    default:
      return (
        <>
          <Title size={1}>Game not found 🤷‍♀️</Title>
          <Button as={Link} href="/">Back</Button>
        </>
      )
  }
}


const GamePage = () => {
  const router = useRouter()
  const code = router.query.code as string | undefined
  const [game, setGame] = useState<Game>()
  const [err, setErr] = useState(false)
  const { user } = GlobalState.useContainer()
  const client = useClient()
  const channel = useChannel(`private-${code}`)
  const { members } = usePresenceChannel(`presence-${code}`)

  useEffect(() => {
    if (!channel) return
    channel.bind(Event.StateUpdated, (data: Game) => setGame(data))
  }, [channel])

  useAsyncFetch(
    async () => {
      const { data } = await client!.get<Game>(`/api/games/${code!}`)
      return data
    },
    g => setGame(g),
    () => setErr(true),
    [client, code]
  )

  if (!user || !game) return (
    <Wrapper>
      <p>⏳ Loading...</p>
    </Wrapper>
  )

  if (err) return (
    <Wrapper>
      <p>👀 Couldn&apos;t find that game</p>
    </Wrapper>
  )

  return (
    <Wrapper>
      <RenderGame game={game} user={user} players={members} />
    </Wrapper>
  )
}

export default GamePage
