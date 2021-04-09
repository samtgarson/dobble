import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button, Control, Field, Input } from "rbx"
import React, { ChangeEvent, FC, FormEvent, useCallback, useState } from "react"
import { DataClient } from "~/src/services/data-client"
import { GlobalState } from "~/src/services/state"
import { fi, pluralize } from "~/src/util"
import { LeagueEntityWithMeta } from "~/types/entities"

type LeaguesListProps = {
  leagues: LeagueEntityWithMeta[]
  showNew: boolean
}

type LeagueItemProps = {
  league: LeagueEntityWithMeta
}

const LeagueItem: FC<LeagueItemProps> = ({ league }) => (
  <li>
    <Link href={`/leagues/${league.id}`}><a>
      <p className="is-flex is-justify-content-space-between is-align-items-center mb-3">
        <strong className="mr-3">{ league.name }</strong>
        <span>
          { pluralize(league.members.length, 'player', 'players') }
        </span>
        {/* <span>👉</span> */}
      </p>
    </a></Link>
  </li>
)

export const LeaguesList: FC<LeaguesListProps> = ({ leagues = [], showNew }) => {
  const { user } = GlobalState.useContainer()
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const client = DataClient.useClient()
  const router = useRouter()

  const createLeague = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (!newName?.length || !user) return

    setLoading(true)
    const newLeague = await client.createLeague(user.id, newName)
    router.push(`/leagues/${newLeague.id}`)
  }, [newName, loading])

  return (
      showNew
        ? <form onSubmit={createLeague}>
            <Field kind="group">
              <Control expanded>
                <Input
                  type="text"
                  disabled={loading}
                  placeholder="Name of your new league"
                  value={newName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                />
              </Control>
              <Control>
                <Button state={fi(loading, 'loading')} color='primary'>Create a league</Button>
              </Control>
            </Field>
          </form>
        : <ul className="mb-4">
            { leagues.map(l => <LeagueItem league={l} key={l.id} />) }
          </ul>
  )
}
