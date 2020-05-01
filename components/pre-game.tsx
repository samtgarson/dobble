import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import copy from 'copy-text-to-clipboard'
import { GameStatus, Game } from "~/types/game"
import { User } from "~/types/api"
import { Tag, Title, Button, Heading, Block, Level } from 'rbx'
import { useClient } from "~/util/use-client"
import { fi } from '~/util'
import { Wrapper } from "./util/wrapper"

type PreGameProps = {
  game: Game
  user: User
  players: Record<string, any>
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const client = useClient()

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    window.fathom('trackGoal', 'MFTZ2U9V', 0)
    client.patch(`/api/games/${game.code}`, {
      players: Object.values(players),
      state: GameStatus.Playing
    })
  }, [client, players])

  const copyCode = useCallback(() => {
    let mounted = true
    copy(game.code)
    setCopied(true)
    setTimeout(() => mounted && setCopied(false), 1000)
    return () => mounted= false
  }, [game])

  const owner = useMemo(() => game.players[game.owner].name, [game])

  return (
    <Wrapper>
      <Level>
        <Level.Item align='left'><Title size={3}>New Game</Title></Level.Item>
        <Level.Item align='right'>
          <Button size='small' pull='right' color="light" onClick={copyCode}>{ copied
            ? '✅ Copied'
            : '📝 Copy game code'
          }</Button>
        </Level.Item>
      </Level>
      <Block>
        { game.owner === user.id
          ? <Button size="large" color="success" state={fi(loading, 'loading')} onClick={startGame}>🚀 Begin Game</Button>
          : <Button size="large" static>Waiting for {owner} to begin</Button>
        }
      </Block>
      <Heading>Players</Heading>
      <Tag.Group size="medium">
        {Object.values(players).map(player =>
          <Tag key={player.id}>{player.name}</Tag>
        )}
        <Button size="small" state="loading" color="light" className="tag"></Button>
      </Tag.Group>
      <style jsx>{`
        /* div { */
        /*   /1* text-align: center; *1/ */
        /*   margin: 30px 0 40px; */
        /*   clear: both; */
        /* } */
      `}</style>
    </Wrapper>
  )
}

export default PreGame
