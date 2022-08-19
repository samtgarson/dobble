import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { FunctionComponent, ReactNode, useCallback, useEffect } from 'react'
import { DataClient } from '~/services/data-client'
import { GlobalState } from '~/services/state'
import { User } from '~/types/api'
import Welcome from './welcome'

const whitelisted = ['/login', '/logout', '/auth']

const setSession = (event: AuthChangeEvent, session: Session | null) =>
  fetch('/api/auth', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session })
  })

export const AuthWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children
}) => {
  const { user, loaded, dispatch } = GlobalState.useContainer()
  const client = DataClient.useClient()

  const setUser = useCallback(
    async (id: string) => {
      if (user?.auth_id) return

      const foundUser = await client.getUserByAuthId(id)
      if (foundUser) dispatch({ user: foundUser })
      else if (user) {
        await client.setAuthIdForUser(user.id, id)
        dispatch({ user: { ...user, auth_id: id } })
      } else dispatch({ user: { auth_id: id } as User })
    },
    [user, client, dispatch]
  )

  useEffect(() => {
    const existingSession = client.auth.session()

    if (existingSession?.user) {
      setSession('SIGNED_IN', existingSession)
      if (user && !user.auth_id)
        dispatch({ user: { ...user, auth_id: existingSession.user.id } })
    } else {
      setSession('SIGNED_OUT', null)
      if (user?.auth_id) dispatch({ user: { ...user, auth_id: undefined } })
    }

    const { data, error } = client.auth.onAuthStateChange((event, session) => {
      setSession(event, session)
      if (event !== 'SIGNED_IN') return
      if (!session?.user) return
      setUser(session.user.id)
    })

    if (error) throw error
    return data?.unsubscribe
  }, [user, client, setUser, dispatch])

  if (!loaded) return null

  return user?.id || whitelisted.includes(location.pathname) ? (
    <>{children}</>
  ) : (
    <Welcome />
  )
}
