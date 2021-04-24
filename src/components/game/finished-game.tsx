import { formatDuration, intervalToDuration } from 'date-fns'
import * as Fathom from 'fathom-client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Heading, Title } from 'rbx'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { User } from '~/types/api'
import { GameEntityWithMeta, Players } from '~/types/entities'
import { fi } from '~/util'
import { DataClient } from '~/services/data-client'
import { useAsyncFetch } from '~/util/use-async'
import { Wrapper } from '~/components/atoms/wrapper'
import { AnimateSharedLayout } from 'framer-motion'
import { PlayerListItem } from './player'
import { LeaguePlayer } from '../leagues/player'

type FinishedGameProps = {
  game: GameEntityWithMeta
  user: User
  players: Players
}

export const FinishedGame: FunctionComponent<FinishedGameProps> = ({ game, user, players }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [nextGame, setNextGame] = useState<GameEntityWithMeta>()
  const client = DataClient.useClient()
  const winner = useMemo(() => game.winner_id && players[game.winner_id], [game])
  const duration  = useMemo(() => {
    if (!game.started_at || !game.finished_at) return

    const duration = intervalToDuration({ start: game.started_at, end: game.finished_at })
    return formatDuration(duration, { format: ['hours', 'minutes', 'seconds'] })
  }, [game])
  const [sortByLeague, setSort] = useState<boolean>(false)

  const newGame = useCallback(async () => {
    if (!client) return
    setLoading(true)
    try {
      const nextGameId = await client.createAnotherGame(user.id, game)
      router.push(`/game/${nextGameId}`)
    } catch (e) {
      if (!e) return
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    Fathom.trackGoal('OQHSDU2R', 0)
  }, [])

  useAsyncFetch(
    ({ nextId }) => client.getGame(nextId),
    setNextGame,
    null,
    { nextId: game?.next_game_id } as { nextId?: string }
  )

  if (!winner) return <Wrapper>Loading...</Wrapper>
  return (
    <Wrapper>
      { game.league &&
        <Heading><strong>{ game.league.name }:</strong> Game { game.league.game_count }</Heading>
      }
      <Title>
        { winner.id === user.id ? '🎉 You won! ' : `😞 ${winner.name} won ` }
        { duration && <Title as='span' size={4} style={{ fontWeight: 400 }} subtitle>(in {duration})</Title> }
      </Title>
      { game.league &&
        <Title as='h2' size={6} className="is-clearfix my-3">
          { sortByLeague ? `${game.league.name} leaderboard` : 'This game\'s results' }
          <Button className="is-pulled-right" size='small' onClick={() => setSort(!sortByLeague)}>
            { sortByLeague
              ? 'View this game\'s results'
              : `View ${game.league.name} leaderboard `
            }
          </Button>
        </Title>
      }
      <ul className="mb-5">
        <AnimateSharedLayout>
          { game.league && sortByLeague
            ? game.league.members.map((m, i) => <LeaguePlayer key={m.id} m={m} i={i} />)
            : Object.values(players)
              .sort((a, b) => a.hand.length - b.hand.length)
              .map((p, i) => <PlayerListItem key={p.id} player={p} i={i} />)
          }
        </AnimateSharedLayout>
      </ul>
      { nextGame
        ? <Link passHref href={`/game/${nextGame.id}`}>
            <Button as='a' size='medium' color="primary">
              { players[nextGame.owner_id].name } started a new game.
              <span style={{ marginLeft: 5, fontWeight: 'bold' }}>Join now</span>
            </Button>
          </Link>
        : <Button color="success" onClick={newGame} state={fi(loading, 'loading')}>Start a new game</Button>
      }
    </Wrapper>
  )
}
