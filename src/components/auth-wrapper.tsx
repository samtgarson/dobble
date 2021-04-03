import { useRouter } from "next/router"
import React, { FunctionComponent, useCallback, useEffect } from "react"
import { GlobalState } from "~/services/state"
import { DataClient } from "../services/data-client"
import Welcome from "./welcome"

const whitelisted = ['/login', '/logout', '/auth']

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
    const { data, error } = client.auth.onAuthStateChange((event, session) => {
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

