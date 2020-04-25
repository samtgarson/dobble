import { Game } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent, useMemo, useEffect, useState, useCallback } from "react"
import { DobbleCard } from "./dobble-card"
import { useClient } from "~/util/use-client"

type RunnerProps = {
  game: Game
  user: User
}

const getTimeLeft = (dateStr: Game['startAt']) => {
  if (!dateStr) return 0
  const date = new Date(dateStr)
  const diff = date.valueOf() - Date.now()
  return Math.floor((diff / 1000) % 60)
}

const Runner: FunctionComponent<RunnerProps> = ({ game, user }) => {
  const hand = useMemo(() => game.players[user.id].hand, [game, user])
  const deck = useMemo(() => game.stack[game.stack.length - 1], [game])
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(game.startAt))
  const client = useClient()

  useEffect(() => {
    if (timeLeft <= 0) return
    setTimeout(() => setTimeLeft(getTimeLeft(game.startAt)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  const match = useMemo(() => (
    hand[0].find(i => deck.includes(i))
   ), [game, hand])

  const handleChoice = useCallback(async (index: number) => {
    if (!client || index !== match) return false
    await client.post(`/api/games/${game.code}/moves`, { match: index })
    return true
  }, [match])

  if (!hand.length) return <p>Dealing...</p>

  return (
    <div className='game'>
      <DobbleCard card={deck} size='small' faceup={true} />
      <DobbleCard card={hand[0]} backText={backText} faceup={!backText} handleChoice={handleChoice}/>
      <style jsx>{`
      `}</style>
    </div>
  )
}

export default Runner
