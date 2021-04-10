import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { Button } from "rbx"
import React, { useState } from "react"
import { LeaguesList } from "~/src/components/leagues/list"
import { DobbleTitle } from "~/src/components/title"
import { Wrapper } from "~/src/components/wrapper"
import { DataClient } from "~/src/services/data-client"
import { GlobalState } from "~/src/services/state"
import { loginUrl } from "~/src/util"
import { LeagueEntityWithMeta } from "~/types/entities"

type LeaguesProps = {
  leagues?: LeagueEntityWithMeta[]
}

const Leagues: NextPage<LeaguesProps> = ({ leagues }) => {
  const { user } = GlobalState.useContainer()
  const [newLeague, setNewLeague] = useState(false)

  return (
    <Wrapper>
      <DobbleTitle text='Leagues'>
        { user?.auth_id && <Button size='small' color='light' onClick={() => setNewLeague(!newLeague)}>{ newLeague ? 'Cancel' : 'New league' }</Button> }
      </DobbleTitle>
      { user?.auth_id
        ? leagues && leagues?.length > 0
          ?<LeaguesList leagues={leagues} showNew={newLeague} />
          : <p>Keep track of who&lsquo;s best at Dobble in your group of friends.&nbsp;</p>
        : <p>
            Keep track of who&lsquo;s best at Dobble in your group of friends.&nbsp;
            <Link href="/login"><a>Sign up to create a league.</a></Link>
          </p>
      }
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<LeaguesProps> = async ({ req }) => {
  const client = DataClient.useClient()
  const user = await client.getUserFromCookie(req)
  if (!user) return {
    redirect: {
      permanent: false,
      destination: loginUrl(req.url)
    }
  }

  const leagues = await client.getLeagues(user.id)
  return { props: { leagues } }
}

export default Leagues
