import { GetServerSideProps, NextPage } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"
import { Button } from 'rbx'
import React, { useCallback, useState } from "react"
import { DobbleTitle } from '~/components/title'
import { Wrapper } from "~/components/wrapper"
import { LeagueEntityWithMeta } from "~/types/entities"
import { LeaguesList } from "../components/leagues/list"
import { QuickGameForm } from "../components/quick-game-form"
import { DataClient } from "../services/data-client"
import { GlobalState } from "../services/state"

type IndexProps = {
  leagues?: LeagueEntityWithMeta[]
}

const Index: NextPage<IndexProps> = ({ leagues }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState<Error>()
  const [newLeague, setNewLeague] = useState(false)
  const { user } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const createGame = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const game = await client.createGame(user.id)
      return goToGame(game.id)
    } catch (e) {
      if (!e) return
      setLoading(false)
      setErr(e)
    }
  }, [])

  const goToGame = useCallback((id = code) => {
    if (!id) return false

    setLoading(true)
    router.push(`/game/${id}`)
  }, [code])

  return (
    <>
      <Wrapper>
        <DobbleTitle text="Dobble">
          <Link href='/about'><Button color='light' as='a'>💜 About</Button></Link>
        </DobbleTitle>
        <QuickGameForm {...{ loading, goToGame, code, setCode, createGame, err } } />
      </Wrapper>
      <Wrapper>
        <DobbleTitle size={5} text='Leagues'>
          { user?.auth_id && <Button size='small' color='light' onClick={() => setNewLeague(!newLeague)}>{ newLeague ? 'Cancel' : '+' }</Button> }
        </DobbleTitle>
        { user?.auth_id
          ? <LeaguesList leagues={leagues ?? []} showNew={newLeague} />
          : <p>Keep track of who&lsquo;s best at Dobble in your group of friends. Sign up to create a league.</p>
        }
      </Wrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async ({ req }) => {
  const client = DataClient.useClient()
  const user = await client.getUserFromCookie(req)
  if (!user) return { props: {} }

  const leagues = await client.getLeagues(user.id)
  return { props: { leagues } }
}

export default Index
