import { Game } from "~/types/game"
import { User } from "~/types/api"
import React, { FunctionComponent } from "react"

type RunnerProps = {
  players: Game['players']
  user: User
}

const Runner: FunctionComponent<RunnerProps> = ({ players, user }) => {
  return <p>✌️ There will be dobble here soon.</p>
}

export default Runner
