import { Game } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent, useMemo, useEffect, useState } from "react"
import { DobbleCard } from "./dobble-card"

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

  useEffect(() => {
    if (timeLeft <= 0) return
    setTimeout(() => setTimeLeft(getTimeLeft(game.startAt)), 1000)
  }, [timeLeft])

  const backText = useMemo(() => {
    if (timeLeft > 1) return `${timeLeft - 1}...`
  }, [timeLeft])

  if (!hand.length) return <p>Dealing...</p>

  return (
    <div className='game'>
      <DobbleCard card={deck} size='small' faceup={true} />
      <DobbleCard card={hand[0]} backText={backText} faceup={!backText}/>
      <style jsx>{`

      `}</style>
    </div>
  )
}

export default Runner
