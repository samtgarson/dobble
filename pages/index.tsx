import React, { ChangeEvent, useState, useCallback } from "react"
import Router from 'next/router'
import { Title, Field, Label, Control, Input, Button } from 'rbx'
import { Game } from "~/types/game"
import { Wrapper } from "~/components/util/wrapper"
import { useClient } from "~/util/use-client"
import { fi } from "~/util"

const Index = () => {
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState<Error>()
  const client = useClient()

  const createGame = useCallback(async () => {
    if (!client) return
    setLoading(true)
    try {
      const { data: { code } } = await client.post<Game>('/api/games')
      return goToGame(code)
    } catch (e) {
      if (!e) return
      setLoading(false)
      setErr(e)
    }
  }, [client])

  const goToGame = useCallback(
    code => Router.push(`/${code}`),
    []
  )

  return (
    <Wrapper>
      <Title size={1}>Let&apos;s play dobble</Title>
      <div className="begin-option">
        <Label>Already got a game code?</Label>
        <Field kind="group">
          <Control loading={loading} expanded>
            <Input
              type="text"
              placeholder="Your game code"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            />
          </Control>
          <Control>
            <Button state={fi(loading, 'loading')} onClick={() => goToGame(code)}>Join Game</Button>
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
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        border: 1px solid #fafafa;
      }

      .begin-option:hover {
        background-color: #fafafa;
      }
      `}</style>
    </Wrapper>
  )
}

export default Index
