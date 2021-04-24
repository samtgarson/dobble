import { GetServerSideProps, NextPage } from 'next'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import PreGame from '~/components/game/pre-game'
import Runner from '~/components/runner'
import { Wrapper } from '~/components/atoms/wrapper'
import { GlobalState } from '~/services/state'
import { FinishedGame } from '~/src/components/game/finished-game'
import { Scoreboard } from '~/src/components/runner/scoreboard'
import { DataClient } from '~/services/data-client'
import { User } from '~/types/api'
import { GameEntityWithMeta, Players } from '~/types/entities'
import { Player } from '~/types/game'
import FourOhFour from '../404'

type RenderGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
  reload (): void
}

const RenderGame: FunctionComponent<RenderGameProps> = ({ game, players, user, reload }) => {
  switch (game.state) {
    case 'OPEN':
      return <PreGame user={user} game={game} players={players} />
    case 'PLAYING':
      return (
        <Runner game={game} player={players[user.id]} reload={reload}>
          <Scoreboard players={players} banner={true} />
        </Runner>
      )
    case 'FINISHED':
      return <FinishedGame game={game} user={user} players={players} />
    default:
      return (
        <Wrapper>
          <p>👀 Couldn&apos;t find that game</p>
        </Wrapper>
      )
  }
}

const GamePage: NextPage<{ game: GameEntityWithMeta, players: Players }> = props => {
  const { user } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const [game, setGame] = useState<GameEntityWithMeta>(props.game)
  const [players, setPlayers] = useState<Players>(props.players)
  const [err, setErr] = useState(false)

  const member = players && user && players[user.id]

  const unsubscribeGame = useRef<() => void>()
  const unsubscribePlayers = useRef<() => void>()

  useEffect(() => {
    setGame(props.game)
    setPlayers(props.players)
  }, [props])

  useEffect(() => {
    if (!user || member) return
    if (game.state !== 'OPEN') return setErr(true)

    const joinGame = async () => {
      await client.joinGame(user.id, game.id)

      const newPlayer: Player = {
        created_at: new Date(),
        game_id: game.id,
        id: user.id,
        name: user.name,
        hand: []
      }
      setPlayers({ ...players, [user.id]: newPlayer })
    }

    joinGame()
  }, [user, game, players])

  useEffect(() => {
    unsubscribeGame.current = client.subscribeToGame(game, setGame)
    unsubscribePlayers.current = client.subscribeToPlayers(game.id, players, setPlayers)

    return () => {
      unsubscribePlayers.current && unsubscribePlayers.current()
      unsubscribeGame.current && unsubscribeGame.current()
    }
  }, [game.id])

  const reload = useCallback(async () => {
    if (!game) return
    const g = await client.getGame(game.id)
    if (g) setGame(g)
  }, [game])

  if (!user) return null
  if (err || !member) return <FourOhFour />

  return (
    <ErrorBoundary fallbackRender={() => <FourOhFour />}>
      <RenderGame game={game} user={user} players={players} reload={reload} />
    </ErrorBoundary>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const client = DataClient.useClient()
  const id = query.code as string

  try {
    const game = await client.getGame(id)
    if (!game) return { notFound: true }
    const players = await client.getPlayers(id)

    if (game.league) {
      const user = await client.getUserFromCookie(req)
      const leagueIds = game.league.members.map(m => m.user.id)
      if (!user || !leagueIds.includes(user.id)) return { notFound: true }
    }

    return { props: { game, players } }
  } catch (err) {
    return { notFound: true }
  }
}

export default GamePage
