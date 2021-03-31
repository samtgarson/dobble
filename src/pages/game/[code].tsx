import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import PreGame from '~/components/pre-game'
import Runner from '~/components/runner'
import { Wrapper } from '~/components/wrapper'
import { GlobalState } from '~/services/state'
import { FinishedGame } from '~/src/components/finished-game'
import { Scoreboard } from '~/src/components/runner/scoreboard'
import { DataClient } from '~/src/services/data-client'
import { useAsyncFetch } from '~/src/util/use-async'
import { User } from '~/types/api'
import { GameEntityWithMeta, Players } from '~/types/entities'
import { GameStatus } from '~/types/game'

type RenderGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
  reload (): void
}

const RenderGame: FunctionComponent<RenderGameProps> = ({ game, players, user, reload }) => {
  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} players={players} />
    case GameStatus.Playing:
      return (
        <>
          <Runner game={game} player={players[user.id]} reload={reload} />
          <Scoreboard players={players} fixed={true} />
        </>
      )
    case GameStatus.Finished:
      return <FinishedGame game={game} user={user} players={players} />
    default:
      return (
        <Wrapper>
          <p>👀 Couldn&apos;t find that game</p>
        </Wrapper>
      )
  }
}

const GameError = () => (
  <Wrapper>
    <p>👀 Couldn&apos;t find that game</p>
  </Wrapper>
)

const GamePage: NextPage = () => {
  const router = useRouter()
  const { code } = router.query as { code?: string }
  const { user } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const [game, setGame] = useState<GameEntityWithMeta>()
  const [players, setPlayers] = useState<Players>()
  const [err, setErr] = useState(false)
  const subs = useRef<(() => void)[]>([])

  const member = players && user && players[user.id]

  useAsyncFetch(
    ({ code }) => client.getGame(code),
    g => setGame(g),
    () => setErr(true),
    { code } as { code?: string }
  )

  useAsyncFetch(
    ({ gameId }) => client.getPlayers(gameId),
    setPlayers,
    () => setErr(true),
    { gameId: game?.id } as { gameId?: string }
  )

  useEffect(() => {
    if (!game || !user || !players || member) return
    if (game.state !== GameStatus.Open) return setErr(true)

    const joinGame = async () => {
      await client.joinGame(user.id, game.id)
      setPlayers({ ...players, [user.id]: { game_id: game.id, id: user.id, name: user.name, hand: [] } })
    }

    joinGame()
  }, [user, game, players])

  useEffect(() => {
    if (!game || !players) return
    let mounted = true
    const unsubscribeGame = client.subscribeToGame(game, g => mounted && setGame(g))
    const unsubscribePlayers = client.subscribeToPlayers(game.id, players, p => mounted && setPlayers(p))

    subs.current = [unsubscribeGame, unsubscribePlayers]
    return () => { mounted = false }
  }, [game, member, players])

  useEffect(() => {
    return () => subs.current.forEach(fn => fn())
  }, [])

  const reload = useCallback(async () => {
    if (!game) return
    const g = await client.getGame(game.id)
    setGame(g)
  }, [game])

  if (!user || !game || !players) return null
  if (err || !member) return <GameError />

  return (
    <ErrorBoundary FallbackComponent={GameError}>
      <RenderGame game={game} user={user} players={players} reload={reload} />
    </ErrorBoundary>
  )
}

export default GamePage
