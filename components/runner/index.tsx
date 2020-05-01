import { Game } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent, useMemo, useEffect, useState, useCallback } from "react"
import { DobbleCard } from "./dobble-card"
import { useClient } from "~/util/use-client"
import { Scoreboard } from "./scoreboard"
import { getTimeLeft } from "~/util"

type RunnerProps = {
  game: Game
  user: User
}

const Runner: FunctionComponent<RunnerProps> = ({ game, user }) => {
  const hand = useMemo(() => game.players[user.id].hand[0], [game, user])
  const deck = useMemo(() => game.stack[game.stack.length - 1], [game])
  const [timeLeft, setTimeLeft] = useState(game.startedAt && getTimeLeft(game.startedAt))
  const client = useClient()

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return
    setTimeout(() => setTimeLeft(game.startedAt && getTimeLeft(game.startedAt)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft && timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  const match = useMemo(() => (
    hand.find(i => deck.includes(i))
   ), [game, hand])

  const [deckCard, setDeckCard ] = useState(deck)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (!mounted) return
      setDeckCard(deck)
    }, 200)

    return () => { mounted = false }
  }, [deck])

  const handleChoice = useCallback(async (index: number) => {
    if (!client || index !== match) return false
    await client.post(`/api/games/${game.code}/moves`, { match: index, deck, hand })
    return true
  }, [match, deck, hand])

  if (!hand.length) return <p>Dealing...</p>

  return (
    <div className='game' key={game.code}>
      <DobbleCard card={deckCard} size='small' faceup={true} />
      <DobbleCard card={hand} backText={backText} faceup={!backText} handleChoice={handleChoice} />
      <Scoreboard players={Object.values(game.players)} fixed={true} />
    </div>
  )
}

export default Runner
