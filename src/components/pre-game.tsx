import * as Fathom from 'fathom-client'
import { Block, Button, Heading, Tag } from 'rbx'
import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import { User } from "~/types/api"
import { GameEntityWithMeta, Players } from "~/types/entities"
import { fi } from '~/util'
import { DataClient } from '../services/data-client'
import { DobbleTitle } from "./title"
import { Wrapper } from "./wrapper"

type PreGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const client = DataClient.useClient()

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    Fathom.trackGoal('MFTZ2U9V', 0)
    client.startGame(game, players)
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
    </Wrapper>
  )
}

export default PreGame
