import {FunctionComponent, useState, useCallback} from "react";
import Axios from 'axios'
import {GlobalState} from "~/services/state";

const { post } = Axios

const Auth: FunctionComponent = () => {
  const { dispatch } = GlobalState.useContainer()
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const createUser = useCallback(async () => {
    if (!name) return

    setLoading(true)
    const { data: { token, user } } = await post('/api/users', { name })
    dispatch({ user, token })
  }, [name])

  return <>
    <h1>Let's play dobble</h1>
    <label>What should we call you?</label>
    <input
      type="text"
      placeholder="Princess Consuela..."
      disabled={loading}
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <button onClick={createUser} disabled={loading}>Go</button>
  </>
}

export default Auth
