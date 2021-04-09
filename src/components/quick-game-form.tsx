import { Label, Field, Control, Input, Button } from "rbx"
import React, { ChangeEvent, FC } from "react"
import { fi } from '~/util'

type QuickGameFormProps = {
  code: string
  loading: boolean
  goToGame (): void
  setCode (code: string): void
  createGame (): void
  err?: Error
}

export const QuickGameForm: FC<QuickGameFormProps> = ({ code, goToGame, loading, setCode, createGame, err }) => (
  <>
    <form action={`/game/${code}`} className="mb-5" onSubmit={e => { e.preventDefault(); goToGame() }}>
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
        <Label>Or create a quick game</Label>
        <Button color="success" onClick={createGame} state={fi(loading, 'loading')}>Play now</Button>
        { err && <p>{ err.message }</p> }
      </Field>
    </div>
  </>
)
