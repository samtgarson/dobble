import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import { GameStatus, Game, Player } from "~/types/game"
import { User } from "~/types/api"
import { Tag, Button, Heading, Block } from 'rbx'
import { useClient } from "~/util/use-client"
import { fi } from '~/util'
import { Wrapper } from "./wrapper"
import { DobbleTitle } from "./title"
import * as Fathom from 'fathom-client'

type PreGameProps = {
  game: Game
  user: User
  players: Record<string, Player>
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const client = useClient()

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    Fathom.trackGoal('MFTZ2U9V', 0)
    client.patch(`/api/games/${game.code}`, {
      players: Object.values(players),
      state: GameStatus.Playing
    })
  }, [client, players])

  const copyCode = useCallback(() => {
    let mounted = true
    const url = location.href

    if (navigator['share'] !== undefined) {
      navigator.share({ title: 'Dobble', url })
    } else {
      navigator.clipboard.writeText(url)
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
          : `📝 ${'share' in navigator ? 'Share game link' : 'Copy game link'}`
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
