import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { GameEntityWithMeta } from "~/types/entities"
import { Player } from "~/types/game"
import { getTimeLeft, playersFrom } from "~/util"
import { useClient } from "~/util/use-client"
import { DobbleCard } from "./dobble-card"
import { Scoreboard } from "./scoreboard"

type RunnerProps = {
  game: GameEntityWithMeta
  user: Player
}

const Runner: FunctionComponent<RunnerProps> = ({ game, user }) => {
  const players = playersFrom(game)
  const hand = useMemo(() => players[user.id].hand[0], [game, user])
  const [timeLeft, setTimeLeft] = useState(game.started_at && getTimeLeft(game.started_at))
  const client = useClient()

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return
    setTimeout(() => setTimeLeft(game.started_at && getTimeLeft(game.started_at)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft && timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  const handleChoice = useCallback(async (index: number) => {
    const match = game.top_card.includes(hand[index])
    if (!client || !match) return false
    return true
  }, [game, hand])

  if (!hand || !hand.length) return <p>Dealing...</p>

  return (
    <div className='game' key={game.id}>
      <DobbleCard card={game.top_card} size='small' faceup={true} />
      <DobbleCard card={hand} backText={backText} faceup={!backText} handleChoice={handleChoice} />
      {/* <Scoreboard players={Object.values(game.players)} fixed={true} /> */}
    </div>
  )
}

export default Runner
