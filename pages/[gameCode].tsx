import { useRouter } from 'next/router'
import {useSharedState} from '@roomservice/react'

const Game = () => {
  const router = useRouter()
  const { gameCode } = router.query
  const [game, updateGame] = useSharedState(gameCode as string)

  return <>
    <h1>Dobble Game {gameCode}</h1>
    <code>{ JSON.stringify(game) }</code>
  </>
}

export default Game
