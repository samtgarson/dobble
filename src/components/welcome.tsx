import Link from 'next/link'
import { Button, Control, Field, Input, Label, Title } from 'rbx'
import React, { ChangeEvent, FunctionComponent, KeyboardEvent, useCallback, useEffect, useState } from "react"
import { GlobalState } from "~/services/state"
import { fi, loginUrl } from "~/util"
import { DataClient } from "../services/data-client"
import { Wrapper } from "./wrapper"

const Auth: FunctionComponent = () => {
  const { dispatch, user } = GlobalState.useContainer()
  const [name, setName] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const client = DataClient.useClient()

  useEffect(() => {
    setInvalid(false)
  }, [name])

  const createUser = useCallback(async () => {
    if (!name) return setInvalid(true)

    setLoading(true)
    const newUser = await client.createUser(name)
    if (user?.auth_id) {
      await client.setAuthIdForUser(newUser.id, user.auth_id)
      newUser.auth_id = user.auth_id
    }
    dispatch({ user: newUser })
  }, [name])

  return (
    <Wrapper>
      <Title size={3}>👋 Let&apos;s play Dobble!</Title>
      <Label>What should we call you?</Label>
      <Field kind="group">
        <Control loading={loading} expanded>
          <Input
            size='large'
            color={invalid ? 'danger' : undefined}
            type="text"
            placeholder="Princess Consuela..."
            disabled={loading}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && createUser()}
          />
        </Control>
        <Control>
          <Button size='large' state={fi(loading, 'loading')} color='success' onClick={createUser} disabled={loading}>Go</Button>
        </Control>
      </Field>
      { !user?.auth_id && <>
        <Label style={{ marginTop: 30 }}>Already got an account?</Label>
        <Link passHref href={loginUrl(location.pathname)}><Button as='a'>Sign In</Button></Link>
      </> }
    </Wrapper>
  )
}

export default Auth
