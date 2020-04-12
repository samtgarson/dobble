import { useRouter } from 'next/router'
import { useSharedState } from '@roomservice/react'
import React, { FunctionComponent, useEffect } from 'react'
import { Game, GameStatus } from '~/types/game'
import { GlobalState } from '~/services/state'
import Runner from '~/components/runner'
import PreGame from '~/components/pre-game'
import { User } from '~/types/api'
import { Container, Section, Title, Button } from 'rbx'
import Link from 'next/link'

type RenderGameProps = {
  game: Game
  updateGame: (cb: (state: Game) => void) => void
  user: User
  code: string
}
const RenderGame: FunctionComponent<RenderGameProps> = ({ game, updateGame, user, code }) => {
  switch (game.state) {
    case GameStatus.Open:
      return <PreGame user={user} game={game} updateGame={updateGame} />
    case GameStatus.Playing:
      return <Runner players={game.players} user={game.players[user.id]} />
    default:
      return <>
        <Title size={1}>Game not found 🤷‍♀️</Title>
        <Button as={Link} href="/">Back</Button>
      </>
  }
}


const GamePage = () => {
  const router = useRouter()
  const code = router.query.code as string
  const [game, updateGame, isConnected] = useSharedState<Game>(code)
  const { user } = GlobalState.useContainer()

  useEffect(() => {
    if (!user || game.state !== GameStatus.Open) return
    if (game.players[user.id]) return

    updateGame(state => {
      state.players[user.id] = user
    })
  }, [user, game])

  if (!user || !isConnected || !code) return (
    <Section>
      <Container>
        <p>⏳ Connecting...</p>
      </Container>
    </Section>
  )

  return <Section>
    <Container>
      <RenderGame updateGame={updateGame} game={game} user={user} code={code} />
    </Container>
  </Section>
}

GamePage.whyDidYouRender = true

export default GamePage
