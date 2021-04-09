import { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { useRouter } from "next/router"
import React, { FunctionComponent, useCallback, useEffect } from "react"
import { GlobalState } from "~/services/state"
import { DataClient } from "../services/data-client"
import Welcome from "./welcome"

const whitelisted = ['/login', '/logout', '/auth']

const setSession = (event: AuthChangeEvent, session: Session | null): Promise<Response> => fetch('/api/auth', {
  method: 'POST',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  credentials: 'same-origin',
  body: JSON.stringify({ event, session })
})

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const { user, loaded, dispatch } = GlobalState.useContainer()
  const client = DataClient.useClient()
  const router = useRouter()

  const setUser = useCallback(async (id: string) => {
    if (user?.auth_id) return

    if (user) {
      await client.setAuthIdForUser(user.id, id)
      dispatch({ user: { ...user, auth_id: id } })
    } else {
      const u = await client.getUserByAuthId(id)
      if (u) dispatch({ user: u })
      else router.push('/logout')
    }
  }, [user])

  useEffect(() => {
    const existingSesssion = client.auth.session()
    if (existingSesssion) setSession('SIGNED_IN', existingSesssion)
    else if (user?.auth_id) dispatch({ user: { ...user, auth_id: undefined } })

    const { data, error } = client.auth.onAuthStateChange((event, session) => {
      setSession(event, session)
      if (event !== 'SIGNED_IN') return
      if (!session) return
      setUser(session.user.id)
    })

    if (error) throw error
    return data?.unsubscribe
  }, [user])

  if (!loaded) return <></>

  return user || whitelisted.includes(location.pathname) ? <>{ children }</> : <Welcome />
}

