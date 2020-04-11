import { Game } from "~/types/game"
import { User } from "~/types/api"
import { FunctionComponent } from "react"

type RunnerProps = {
  players: Game['players']
  user: User
}

const Runner: FunctionComponent<RunnerProps> = ({ players, user }) => {
  return <code>{ JSON.stringify(players) }</code>
}

export default Runner
