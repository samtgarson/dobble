import React, { ChangeEvent, FunctionComponent, useState, useCallback, useEffect } from "react"
import Axios from 'axios'
import { GlobalState } from "~/services/state"
import { Container, Section, Title, Field, Label, Control, Input, Button } from 'rbx'

const { post } = Axios

const Auth: FunctionComponent = () => {
  const { dispatch } = GlobalState.useContainer()
  const [name, setName] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInvalid(false)
  }, [name])

  const createUser = useCallback(async () => {
    if (!name) return setInvalid(true)

    setLoading(true)
    const { data: { token, user } } = await post('/api/users', { name })
    dispatch({ user, token })
  }, [name])

  return <Section>
    <Container>
      <Title size={1}>Let&apos;s play dobble</Title>
      <Field>
        <Label>What should we call you?</Label>
        <Control loading={loading}>
          <Input
            color={invalid ? 'danger' : undefined}
            type="text"
            placeholder="Princess Consuela..."
            disabled={loading}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </Control>
      </Field>
      <Field>
        <Button state={loading && 'loading'} color='success' onClick={createUser} disabled={loading}>Go</Button>
      </Field>
    </Container>
  </Section>
}

export default Auth
