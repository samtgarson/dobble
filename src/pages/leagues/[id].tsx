import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { Button, Heading } from "rbx"
import React, { useCallback, useState } from 'react'
import { CopyButton } from "~/src/components/atoms/copy-button"
import { LeaguePlayer } from "~/src/components/leagues/player"
import { OpenGameButton } from "~/src/components/leagues/open-game-button"
import { DobbleTitle } from '~/src/components/atoms/title'
import { Wrapper } from "~/src/components/atoms/wrapper"
import { DataClient } from "~/src/services/data-client"
import { GlobalState } from "~/src/services/state"
import { fi, loginUrl, pluralize } from "~/src/util"
import { GameEntity, LeagueEntityWithMeta } from '~/types/entities'

type LeaguePageProps = {
  league: LeagueEntityWithMeta
  openGame?: GameEntity
}

const LeaguePage: NextPage<LeaguePageProps> = ({ league, openGame }) => {
  const { user } = GlobalState.useContainer()
  const [loading, setLoading] = useState(false)
  const client = DataClient.useClient()
  const router = useRouter()

  /* const role = league.members.find(m => m.user.id === user?.id)?.membership.role ?? 'PLAYER' */

  const createGame = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const newGame = await client.createGame(user.id, league.id)
    router.push(`/game/${newGame.id}`)
  }, [user])

  return (
    <Wrapper>
      <DobbleTitle text={league.name}>
        <CopyButton label='invite url' title={`Join ${league.name} for Dobble`} path={`/leagues/${league.id}/join`} />
      </DobbleTitle>
      <Button.Group className="mb-5">
        { openGame
          ? <OpenGameButton game={openGame} league={league} />
          : <Button state={fi(loading, 'loading')} size='large' onClick={createGame} color='success'>New Game</Button>
        }
        <Button className="unclickable" size='large' color='light' as='span'>{ pluralize(league.game_count, 'game', 'games') } played</Button>
      </Button.Group>
      <Heading className="mb-3" size={6}>Players</Heading>
      <ol>
        { league.members.map((m, i) => <LeagueItem key={m.id} {...{ m, i }} />) }
      </ol>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<LeaguePageProps> = async ({ req, query }) => {
  const client = DataClient.useClient()
  const user = await client.getUserFromCookie(req)
  if (!user) return {
    redirect: { permanent: false, destination: loginUrl(req.url) }
  }

  const leagueId = query.id as string
  const league = await client.getLeague(leagueId)
  console.log(user, league)
  if (!league || !league.members.find(m => m.user.id == user.id)) return { notFound: true }

  const [openGame] = await client.getOpenLeagueGames(leagueId)
  return { props: { league, openGame } }
}

export default LeaguePage
