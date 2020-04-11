import React, {useState, useCallback, useMemo, useContext} from "react";
import Router from 'next/router'
import {GlobalState} from "~/services/state";
import {createClient} from "~/util/client";
import {RoomServiceContext} from "@roomservice/react/dist/context";

const Index = () => {
  const { token } = GlobalState.useContainer()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [err, setErr] = useState<Error>()
  const roomClient = useContext(RoomServiceContext)

  const client = useMemo(() => token && createClient(token), [token])

  const createGame = useCallback(async () => {
    if (!client || !roomClient) return
    setLoading(true)
    try {
      const { data: { code } } = await client.post('/api/games')
      if (code && code.length) {
        const room = roomClient.room(code)
        await room.init()
        await room.setDoc((prev = {}) => {
          prev.state = 'open'
          prev.players = {}
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

  return <>
    <h1>Dobble</h1>
    <input
      type="text"
      placeholder="Your game code"
      value={code}
      onChange={e => setCode(e.target.value)}
    />
    <button onClick={() => goToGame(code)}>Go</button>
    <p>or</p>
    <button onClick={createGame} disabled={loading}>Create a new game</button>
    { err && <p>{ err.message }</p> }
  </>
}

export default Index
