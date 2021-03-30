import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import PreGame from '~/components/pre-game'
import Runner from '~/components/runner'
import { Wrapper } from '~/components/wrapper'
import { GlobalState } from '~/services/state'
import { DataClient } from '~/src/services/data-client'
import { playersFrom } from '~/src/util'
import { useAsyncFetch } from '~/src/util/use-async'
import { User } from '~/types/api'
import { GameEntityWithMeta } from '~/types/entities'
import { GameStatus } from '~/types/game'

type RenderGameProps = {
  game: GameEntityWithMeta
  user: User
}

const RenderGame: FunctionComponent<RenderGameProps> = ({ game, user }) => {
  const players = playersFrom(game)
  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} players={players} />
    case GameStatus.Playing:
      return <Runner game={game} user={players[user.id]} />
    {/* case GameStatus.Finished: */}
    {/*   return <FinishedGame game={game} user={user} /> */}
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
  const { code } = router.query as { code?: string }
  const { user } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const [game, setGame] = useState<GameEntityWithMeta>()
  const [err, setErr] = useState(false)

  useAsyncFetch(
    ({ code }) => client.getGame(code),
    g => setGame(g),
    () => setErr(true),
    { code } as { code?: string }
  )

  useEffect(() => {
    if (!game || !user) return
    if (game.players.find(p => p.id === user.id)) return
    if (game.state !== GameStatus.Open) return setErr(true)

    const joinGame = async () => {
      await client.joinGame(user.id, game.id)
      setGame({ ...game, players: [
        ...game.players,
        { ...user, game_id: game.id, hand: [] }
      ] })
    }

    joinGame()
  }, [user, game])

  useEffect(() => {
    if (!game) return
    let mounted = true
    const unsubscribe = client.subscribeToGame(game, g => mounted && setGame(g))

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [game?.id])

  if (err) return (
    <Wrapper>
      <p>👀 Couldn&apos;t find that game</p>
    </Wrapper>
  )

  if (!user || !game) return null

  return <RenderGame game={game} user={user} />
}

export default GamePage
