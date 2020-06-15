import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import copy from 'copy-text-to-clipboard'
import { GameStatus, Game } from "~/types/game"
import { User } from "~/types/api"
import { Tag, Button, Heading, Block } from 'rbx'
import { useClient } from "~/util/use-client"
import { fi } from '~/util'
import { Wrapper } from "./wrapper"
import { DobbleTitle } from "./title"

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
    if (window.fathom) window.fathom.trackGoal('MFTZ2U9V', 0)
    client.patch(`/api/games/${game.code}`, {
      players: Object.values(players),
      state: GameStatus.Playing
    })
  }, [client, players])

  const copyCode = useCallback(() => {
    let mounted = true
    const url = new URL(`/game/${game.code}`, process.env.VERCEL_URL).toString()

    if (navigator.share) {
      navigator.share({ title: 'Dobble', url })
    } else {
      copy(url)
      setCopied(true)

      setTimeout(() => mounted && setCopied(false), 1000)
    }

    return () => mounted = false
  }, [game])

  const owner = useMemo(() => game.players[game.owner].name, [game])

  return (
    <Wrapper>
      <DobbleTitle text="New game">
        <Button size='small' color="light" onClick={copyCode}>{ copied
          ? '✅ Copied'
          : `📝 ${navigator.share ? 'Share game link' : 'Copy game link'}`
        }</Button>
      </DobbleTitle>
      <Block>
        { game.owner === user.id
          ? <Button className="start-button" size="large" color="success" state={fi(loading, 'loading')} onClick={startGame}>🚀 Begin Game</Button>
          : <Button className="start-button" size="large" static>Waiting for {owner} to begin</Button>
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
        :global(.start-button) {
          height: auto;
          white-space: normal;
        }
      `}</style>
    </Wrapper>
  )
}

export default PreGame
