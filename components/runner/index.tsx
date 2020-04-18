import { Game, UpdateGame } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent, useMemo, useEffect } from "react"
import { DobbleCard } from "./dobble-card"

type RunnerProps = {
  game: Game
  user: User
}

const Runner: FunctionComponent<RunnerProps> = ({ game, user }) => {
  const isOwner = useMemo(() => game.owner === user.id, [user, game])
  const hand = useMemo(() => game.players[user.id].hand, [game, user])

  if (!hand.length) return <p>Dealing...</p>

  return <DobbleCard card={hand[0]} />
}

export default Runner
