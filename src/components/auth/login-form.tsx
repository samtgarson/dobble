import { Button, Control, Field, Input } from 'rbx'
import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { DataClient } from '~/services/data-client'

export const LoginForm: FC<{ redirect: string }> = ({ redirect }) => {
  const client = DataClient.useClient()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const login = async (evt: FormEvent) => {
    evt.preventDefault()
    const res = await client.auth.signIn(
      { email, password },
      { redirectTo: redirect }
    )
    console.log(res)

    if (res.error) await client.auth.signUp({ email, password })
  }

  return (
    <form onSubmit={login}>
      <p className='mb-3'>Or, use an email and password</p>
      <Field horizontal>
        <Field.Body>
          <Field>
            <Control>
              <Input
                name='email'
                type='email'
                value={email}
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  setEmail(evt.target.value)
                }
                placeholder='Email'
              />
            </Control>
          </Field>
          <Field>
            <Control>
              <Input
                name='password'
                type='password'
                value={password}
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  setPassword(evt.target.value)
                }
                placeholder='Password'
              />
            </Control>
          </Field>
          <Button>Go</Button>
        </Field.Body>
      </Field>
    </form>
  )
}
