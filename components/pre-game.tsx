import React, { FunctionComponent, useCallback, useMemo } from "react"
import { Game, GameStatus } from "~/types/game"
import Mices from "./mices"
import { User } from "~/types/api"
import { Tag, Title, Button } from 'rbx'

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

  const owner = useMemo(() => game.players[game.owner].name, [game])

  return <>
    <div>{ game.owner === user.id
      ? <Button size="large" color="success" onClick={startGame}>🚀 Begin Game</Button>
      : <Button size="large" static>Waiting for {owner} to begin</Button>
    }</div>
    <Title size={5}>Players</Title>
    <Tag.Group size="medium">{players.map(player =>
      <Tag key={player.id}>{player.name}</Tag>
    )}</Tag.Group>
    <Mices code={game.code} name={user.name} />
    <style jsx>{`
      div {
        text-align: center;
        margin: 20px 0 50px;
      }
    `}</style>
  </>
}

export default PreGame
