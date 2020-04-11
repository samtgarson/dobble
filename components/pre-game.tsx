import {FunctionComponent, useCallback, useMemo} from "react";
import {Game, GameStatus} from "~/types/game";
import Mices from "./mices";
import {User} from "~/types/api";

type PreGameProps = {
  updateGame: (cb: (state: Game) => void) => void
  game: Game
  user: User
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, updateGame, user }) => {
  const players = useMemo(() => Object.values(game.players), [game])

  const startGame = useCallback(() => {
    updateGame(state => state.state = GameStatus.Playing)
  }, [game])

  return <>
    <ul>{players.map(player =>
      <li key={player.id}>{player.name}</li>
    )}</ul>
    <button onClick={startGame}>Begin</button>
    <Mices code={game.code} name={user.name} />
  </>
}

export default PreGame
