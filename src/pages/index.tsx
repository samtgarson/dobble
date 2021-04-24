import { NextPage } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"
import { Button } from 'rbx'
import React, { useCallback, useState } from "react"
import { DobbleTitle } from '~/components/atoms/title'
import { Wrapper } from "~/components/atoms/wrapper"
import { QuickGameForm } from "../components/game/quick-game-form"
import { DataClient } from "../services/data-client"
import { GlobalState } from "../services/state"

const Index: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState<Error>()
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
      <Wrapper featured><Link href='/leagues'><a>
        <strong>New!</strong> Leagues let you keep track of scores with friends.&nbsp;
        <span className='underlined'>Take a look</span>
      </a></Link></Wrapper>
      <Wrapper>
        <DobbleTitle text="Dobble">
          <Link href='/about'><Button color='light' as='a'>💜 About</Button></Link>
        </DobbleTitle>
        <QuickGameForm {...{ loading, goToGame, code, setCode, createGame, err } } />
      </Wrapper>
    </>
  )
}

export default Index
