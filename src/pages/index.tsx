import React, { ChangeEvent, useState, useCallback, KeyboardEvent } from "react"
import Link from 'next/link'
import Router from 'next/router'
import { Field, Label, Control, Input, Button } from 'rbx'
import { Wrapper } from "~/components/wrapper"
import { DobbleTitle } from '~/components/title'
import { fi } from "~/util"
import { NextPage } from "next"
import { GlobalState } from "../services/state"
import { DataClient } from "../services/data-client"

const Index: NextPage = () => {
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

  const goToGame = useCallback(
    code => {
      if (!code) return
      setLoading(true)
      Router.push('/game/[code]', `/game/${code}`)
    }, []
  )

  return (
    <Wrapper>
      <DobbleTitle text="Dobble">
        <Link href='/about'><Button color='light' as='a'>💜 About</Button></Link>
      </DobbleTitle>
      <div className="begin-option">
        <Label>Already got a game code?</Label>
        <Field kind="group">
          <Control expanded>
            <Input
              type="text"
              disabled={loading}
              placeholder="Your game code"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && goToGame(code)}
            />
          </Control>
          <Control>
            <Button state={fi(loading, 'loading')} onClick={() => goToGame(code)}>Join</Button>
          </Control>
        </Field>
      </div>
      <div className="begin-option">
        <Field>
          <Label>Or create a new game</Label>
          <Button color="success" onClick={createGame} state={fi(loading, 'loading')}>Create a new game</Button>
          { err && <p>{ err.message }</p> }
        </Field>
      </div>
      <style jsx>{`
      .begin-option {
        margin-bottom: 20px;
      }
      `}</style>
    </Wrapper>
  )
}

export default Index
