import { useRouter } from 'next/router'
import {useSharedState } from '@roomservice/react'
import {useEffect } from 'react'
import {Game, GameStatus} from '~/types/game'
import {GlobalState} from '~/services/state'
import Runner from '~/components/runner'
import PreGame from '~/components/pre-game'

const GamePage = () => {
  const router = useRouter()
  const { code } = router.query
  const [game, updateGame, isConnected] = useSharedState<Game>(code as string)
  const { user } = GlobalState.useContainer()

  useEffect(() => {
    if (!user || game.state !== GameStatus.Open) return
    if (game.players[user.id]) return

    updateGame(state => {
      state.players[user.id] = { ...user, points: 0 }
    })
  }, [user, game])

  if (!user || !isConnected) return <p>Connecting...</p>

  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} updateGame={updateGame} />
    case GameStatus.Playing:
      return <>
        <h1>Dobble Game {code}</h1>
        <Runner players={game.players} user={game.players[user.id]} />
      </>
    default:
      return <h1>Game not found</h1>
  }
}

export default GamePage
