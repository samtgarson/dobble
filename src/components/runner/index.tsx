import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { DataClient } from "~/services/data-client"
import { GameEntityWithMeta } from "~/types/entities"
import { Player } from "~/types/game"
import { getTimeLeft } from "~/util"
import { Wrapper } from "../wrapper"
import { DobbleCard } from "./dobble-card"
import styles from '~/styles/components/dobble-card.module.scss'

type RunnerProps = {
  game: GameEntityWithMeta
  player: Player
  reload (): void
}

const Runner: FunctionComponent<RunnerProps> = ({ game, player, reload, children }) => {
  const hand = useMemo(() => player.hand[0], [game, player])
  const [timeLeft, setTimeLeft] = useState(game.started_at && getTimeLeft(game.started_at))
  const client = DataClient.useClient()
  const [topCard, setTopCard] = useState(game.top_card)
  const [newCard, setNewCard] = useState(false)
  const [cardRotation, setCardRotation] = useState(0)

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return
    setTimeout(() => setTimeLeft(game.started_at && getTimeLeft(game.started_at)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft && timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  const handleChoice = useCallback(async (icon: number) => {
    if (newCard) return false
    const match = game.top_card.includes(icon)
    if (!client || !match) return false

    try {
      await client.playCard(game.id, player, game.position + 1)
      return true
    } catch (err) {
      reload()
      return false
    }
  }, [game, hand, newCard])

  useEffect(() => {
    let mounted = true
    setTopCard(game.top_card)
    setNewCard(true)

    setTimeout(() =>{
      if (mounted) setNewCard(false)
    }, 700)

    return () => { mounted = false }
  }, [game.top_card])

  const rotationHandler = useCallback((e: KeyboardEvent) => {
    console.log(e.code, cardRotation)
    switch (e.code) {
      case 'ArrowLeft':
        return setCardRotation(cardRotation - 10)
      case 'ArrowRight':
        return setCardRotation(cardRotation + 10)
      case 'Space':
        return setCardRotation(0)
    }
  }, [cardRotation, setCardRotation])

  useEffect(() => {
    document.addEventListener('keydown', rotationHandler)
    return () => { document.removeEventListener('keydown', rotationHandler) }
  }, [rotationHandler])

  if (!hand || !hand.length) return <Wrapper><p>🃏 Dealing...</p></Wrapper>

  return (
    <div className={styles.game}>
      <DobbleCard card={topCard} size='small' backText='Ready...' faceUp={!newCard} />
      <DobbleCard
        card={hand}
        backText={backText}
        faceUp={!backText}
        handleChoice={handleChoice}
        rotate={cardRotation}
      />
      { children }
    </div>
  )
}

export default Runner
