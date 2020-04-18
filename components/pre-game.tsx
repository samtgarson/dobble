import React, { FunctionComponent, useCallback, useMemo, useState, useEffect } from "react"
import { Game, GameStatus } from "~/types/game"
import { User } from "~/types/api"
import { Tag, Title, Button } from 'rbx'
import { useClient } from "~/util/use-client"

type PreGameProps = {
  game: Game
  user: User
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user }) => {
  const [loading, setLoading] = useState(false)
  const players = useMemo(() => Object.values(game.players), [game])
  const client = useClient()

  useEffect(() => {
    if (!client) return
    const joinGame = async () => client.get<Game>(`/api/games/${game.code}`)
    if (game.state !== GameStatus.Open) return
    if (game.players && game.players[user.id]) return

    joinGame()
  }, [client])

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    client.patch(`/api/games/${game.code}`, { state: GameStatus.Playing })
  }, [client])

  const owner = useMemo(() => game.players[game.owner].name, [game])

  return (
    <>
      <div>
        { game.owner === user.id
          ? <Button size="large" color="success" state={loading && 'loading'} onClick={startGame}>🚀 Begin Game</Button>
          : <Button size="large" static>Waiting for {owner} to begin</Button>
        }
      </div>
      <Title size={5}>Players</Title>
      <Tag.Group size="medium">
        {players.map(player =>
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
