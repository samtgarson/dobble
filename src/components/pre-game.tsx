import * as Fathom from 'fathom-client'
import { Block, Button, Heading, Tag } from 'rbx'
import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import { User } from "~/types/api"
import { GameEntityWithPlayers } from "~/types/entities"
import { GameStatus, Player } from "~/types/game"
import { fi } from '~/util'
import { useClient } from "~/util/use-client"
import { DobbleTitle } from "./title"
import { Wrapper } from "./wrapper"

type PreGameProps = {
  game: GameEntityWithPlayers
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
    client.patch(`/api/games/${game.id}`, {
      players: Object.values(players),
      state: GameStatus.Playing
    })
  }, [client, players])

  const copyCode = useCallback(() => {
    let mounted = true
    const url = location.href

    if (navigator['share'] !== undefined) {
      navigator.share({ title: 'Dobble', url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(() => mounted && setCopied(false), 1000)
    }

    return () => mounted = false
  }, [game])

  const owner = useMemo(() => players[game.owner_id]?.name, [players, game])

  return (
    <Wrapper>
      <DobbleTitle text="New game">
        <Button size='small' color="light" onClick={copyCode}>{ copied
          ? '✅ Copied'
          : `📝 ${'share' in navigator ? 'Share game link' : 'Copy game link'}`
        }</Button>
      </DobbleTitle>
      <Block>
        { game.owner_id === user.id
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
