import * as Fathom from 'fathom-client'
import { Block, Button, Heading, Tag } from 'rbx'
import React, { FunctionComponent, useCallback, useMemo, useState } from "react"
import { User } from "~/types/api"
import { GameEntityWithMeta, Players } from "~/types/entities"
import { fi } from '~/util'
import { DataClient } from '../services/data-client'
import { CopyButton } from './copy-button'
import { DobbleTitle } from "./title"
import { Wrapper } from "./wrapper"

type PreGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
}

const PreGame: FunctionComponent<PreGameProps> = ({ game, user, players }) => {
  const [loading, setLoading] = useState(false)
  const client = DataClient.useClient()

  const startGame = useCallback(() => {
    if (!client) return
    setLoading(true)
    Fathom.trackGoal('MFTZ2U9V', 0)
    client.startGame(game, players)
  }, [client, players])

  const owner = useMemo(() => players[game.owner_id]?.name, [players, game])

  return (
    <Wrapper>
      { game.league &&
        <Heading><strong>{ game.league.name }:</strong> Game { game.league?.game_count + 1 }</Heading>
      }
      <DobbleTitle text="New game">
        <CopyButton label='game link' />
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
        <Tag color='white' key="loading" className='has-text-grey-dark'>
          <span className="loader mr-3" />
          Waiting for other players
        </Tag>
      </Tag.Group>
    </Wrapper>
  )
}

export default PreGame
