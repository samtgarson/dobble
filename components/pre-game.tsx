import React, { FunctionComponent, useCallback, useMemo, useState, useEffect } from "react"
import { Game, GameStatus } from "~/types/game"
import { User } from "~/types/api"
import { Tag, Title, Button } from 'rbx'
import { useClient } from "~/util/use-client"
import { fi } from '~/util'

type PreGameProps = {
  game: Game
  user: User
  players: Record<string, any>
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const client = useClient()

  /* useEffect(() => { */
  /*   if (!client) return */
  /*   if (game.state !== GameStatus.Open) return */
  /*   if (game.players && game.players[user.id]) return */
  /* }, [client]) */

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    client.patch(`/api/games/${game.code}`, {
      players: Object.values(players),
      state: GameStatus.Playing
    })
  }, [client, players])

  const owner = useMemo(() => game.players[game.owner].name, [game])

  return (
    <>
      <div>
        { game.owner === user.id
          ? <Button size="large" color="success" state={fi(loading, 'loading')} onClick={startGame}>🚀 Begin Game</Button>
          : <Button size="large" static>Waiting for {owner} to begin</Button>
        }
      </div>
      <Title size={5}>Players</Title>
      <Tag.Group size="medium">
        {Object.values(players).map(player =>
          <Tag key={player.id}>{player.name}</Tag>
        )}
      </Tag.Group>
      <style jsx>{`
        div {
          text-align: center;
          margin: 20px 0 50px;
        }
      `}</style>
    </>
  )
}

export default PreGame
