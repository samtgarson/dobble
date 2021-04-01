import { NextPage } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"
import { Button, Control, Field, Input, Label } from 'rbx'
import React, { ChangeEvent, useCallback, useState } from "react"
import { DobbleTitle } from '~/components/title'
import { Wrapper } from "~/components/wrapper"
import { fi } from "~/util"
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
    <Wrapper>
      <DobbleTitle text="Dobble">
        <Link href='/about'><Button color='light' as='a'>💜 About</Button></Link>
      </DobbleTitle>
      <form action={`/game/${code}`} style={{ marginBottom: 20 }} onSubmit={e => { e.preventDefault(); goToGame() }}>
        <Label>Already got a game code?</Label>
        <Field kind="group">
          <Control expanded>
            <Input
              type="text"
              disabled={loading}
              placeholder="Your game code"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            />
          </Control>
          <Control>
            <Button state={fi(loading, 'loading')}>Join</Button>
          </Control>
        </Field>
      </form>
      <div className="begin-option">
        <Field>
          <Label>Or create a new game</Label>
          <Button color="success" onClick={createGame} state={fi(loading, 'loading')}>Create a new game</Button>
          { err && <p>{ err.message }</p> }
        </Field>
      </div>
    </Wrapper>
  )
}

export default Index
