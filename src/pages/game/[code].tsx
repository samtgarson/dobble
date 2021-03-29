import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { FinishedGame } from '~/components/finished-game'
import PreGame from '~/components/pre-game'
import Runner from '~/components/runner'
import { Wrapper } from '~/components/wrapper'
import { GlobalState } from '~/services/state'
import { DataClient } from '~/src/services/data-client'
import { useAsyncFetch } from '~/src/util/use-async'
import { User } from '~/types/api'
import { GameEntityWithPlayers } from '~/types/entities'
import { GameStatus } from '~/types/game'

type RenderGameProps = {
  game: GameEntityWithPlayers
  user: User
}

const RenderGame: FunctionComponent<RenderGameProps> = ({ game, user }) => {
  const players = game.players.reduce((hsh, player) => ({ ...hsh, [player.id]: player }), {})
  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} players={players} />
    {/* case GameStatus.Playing: */}
    {/*   return <Runner game={game} user={players[user.id]} /> */}
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
  const code = router.query.code as string
  const { user } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const [game, setGame] = useState<GameEntityWithPlayers>()
  const [err, setErr] = useState(false)

  useAsyncFetch(
    ({ user, code }) => {
      return client.getGame(user.id, code)
    },
    g => setGame(g),
    () => setErr(true),
    { user, code } as { user?: User, code?: string }
  )

  useEffect(() => {
    if (!game || !user) return
    if (game.players.find(p => p.id === user.id)) return
    if (game.state !== GameStatus.Open) return setErr(true)

    const joinGame = async () => {
      await client.joinGame(user.id, game.id)
      setGame({ ...game, players: [...game.players, { ...user, hand: [] }] })
    }

    joinGame()
  }, [user, game])

  if (err) return (
    <Wrapper>
      <p>👀 Couldn&apos;t find that game</p>
    </Wrapper>
  )

  if (!user || !game) return null

  return <RenderGame game={game} user={user} />
}

export default GamePage
