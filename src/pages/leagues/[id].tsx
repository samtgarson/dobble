import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { Button, Heading } from "rbx"
import React, { useCallback, useState } from 'react'
import { DobbleTitle } from '~/src/components/title'
import { Wrapper } from "~/src/components/wrapper"
import { DataClient } from "~/src/services/data-client"
import { GlobalState } from "~/src/services/state"
import { fi, medals, pluralize } from "~/src/util"
import { LeagueEntityWithMeta } from '~/types/entities'

const LeaguePage: NextPage<{ league: LeagueEntityWithMeta }> = ({ league }) => {
  const { user } = GlobalState.useContainer()
  const [loading, setLoading] = useState(false)
  const client = DataClient.useClient()
  const router = useRouter()

  const createGame = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const newGame = await client.createGame(user.id, league.id)
    router.push(`/game/${newGame.id}`)
  }, [user])

  return (
    <Wrapper>
      <DobbleTitle text={league.name} />
      <Button.Group className="mb-5">
        <Button state={fi(loading, 'loading')} size='large' onClick={createGame} color='success'>New Game</Button>
        <Button className="unclickable" size='large' color='light' as='span'>{ pluralize(league.game_count, 'game', 'games') } played</Button>
      </Button.Group>
      <Heading className="mb-3" size={6}>Players</Heading>
      <ol>
        { league.members.map((m, i) => (
          <li
            className="is-flex is-justify-content-space-between is-align-items-center mb-3"
            key={m.membership.id}
          >
            <span>
              { i < 3 && medals[i] }
              { m.user.name }
            </span>
            { m.cards_left &&
              <span>{ pluralize(m.cards_left, 'card', 'cards') } left</span>
            }
          </li>
        )) }
      </ol>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps  = async ({ req, query }) => {
  const client = DataClient.useClient()
  const user = await client.getUserFromCookie(req)
  if (!user) return { notFound: true }

  const leagueId = query.id as string
  const league = await client.getLeague(leagueId)
  return { props: { league } }
}

export default LeaguePage
