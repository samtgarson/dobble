import { Game } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent, useMemo } from "react"
import { DobbleCard } from "./dobble-card"

type RunnerProps = {
  game: Game
  user: User
}

const Runner: FunctionComponent<RunnerProps> = ({ game, user }) => {
  const hand = useMemo(() => game.players[user.id].hand, [game, user])
  const deck = useMemo(() => game.stack[game.stack.length - 1], [game])

  if (!hand.length) return <p>Dealing...</p>

  return (
    <>
      <DobbleCard card={deck} size='small' />
      <DobbleCard card={hand[0]} />
    </>
  )
}

export default Runner
