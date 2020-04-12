import React, { ChangeEvent, useState, useCallback, useMemo, useContext } from "react"
import Router from 'next/router'
import { GlobalState } from "~/services/state"
import { createClient } from "~/util/client"
import { RoomServiceContext } from "@roomservice/react/dist/context"
import { Container, Section, Title, Field, Label, Control, Input, Button } from 'rbx'
import { Game, GameStatus } from "~/types/game"

const Index = () => {
  const { token, user } = GlobalState.useContainer()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState<Error>()
  const roomClient = useContext(RoomServiceContext)

  const client = useMemo(() => token && createClient(token), [token])

  const createGame = useCallback(async () => {
    if (!client || !roomClient || !user) return
    setLoading(true)
    try {
      const { data: { code } } = await client.post('/api/games')
      if (code && code.length) {
        const room = roomClient.room(code)
        await room.init()
        await room.setDoc<Game>(prev => {
          prev.state = GameStatus.Open
          prev.players = { [user.id]: user }
          prev.owner = user.id
          prev.code = code
        })
        room.disconnect()
        return goToGame(code)
      }

      setErr(new Error('Could not create a new game'))
    } catch (e) {
      setErr(e)
    }
  }, [client])

  const goToGame = useCallback(
    code => Router.push(`/${code}`),
    []
  )

  return <Section>
    <Container>
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
            <Button state={loading && 'loading'} onClick={() => goToGame(code)}>Join Game</Button>
          </Control>
        </Field>
      </div>
      <div className="begin-option">
        <Field>
          <Label>Or create a new game</Label>
          <Button color="success" onClick={createGame} state={loading && 'loading'}>Create a new game</Button>
          { err && <p>{ err.message }</p> }
        </Field>
      </div>
    </Container>
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
  </Section>
}

export default Index
