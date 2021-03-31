import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { DataClient } from "~/src/services/data-client"
import { GameEntityWithMeta } from "~/types/entities"
import { Player } from "~/types/game"
import { getTimeLeft } from "~/util"
import { Wrapper } from "../wrapper"
import { DobbleCard } from "./dobble-card"

type RunnerProps = {
  game: GameEntityWithMeta
  player: Player
  reload (): void
}

const Runner: FunctionComponent<RunnerProps> = ({ game, player, reload }) => {
  const hand = useMemo(() => player.hand[0], [game, player])
  const [timeLeft, setTimeLeft] = useState(game.started_at && getTimeLeft(game.started_at))
  const client = DataClient.useClient()

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return
    setTimeout(() => setTimeLeft(game.started_at && getTimeLeft(game.started_at)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft && timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  const handleChoice = useCallback(async (icon: number) => {
    const match = game.top_card.includes(icon)
    if (!client || !match) return false

    try {
      await client.playCard(game.id, player, game.position + 1)
      return true
    } catch (err) {
      reload()
      return false
    }
  }, [game, hand])

  if (!hand || !hand.length) return <Wrapper><p>🃏 Dealing...</p></Wrapper>

  return (
    <div className='game' key={game.id}>
      <DobbleCard card={game.top_card} size='small' faceup={true} />
      <DobbleCard card={hand} backText={backText} faceup={!backText} handleChoice={handleChoice} />
    </div>
  )
}

export default Runner
