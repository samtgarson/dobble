import { PusherProviderProps, PusherProvider } from "@harelpls/use-pusher"
import React, { FunctionComponent } from "react"
import { GlobalState } from "~/services/state"
import Auth from "./auth"

type Headers = { [key: string]: string }
const createConfig = (headers: Headers): PusherProviderProps => {
  const clientKey = process.env.PUSHER_KEY
  const cluster = process.env.PUSHER_CLUSTER
  if (!clientKey || !cluster) throw new Error('Missing Pusher client creds')
  return {
    clientKey,
    cluster,
    auth: { headers, params: {} },
    triggerEndpoint: '/api/publish',
    authEndpoint: '/api/pusher'
  }
}

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const { token, loaded } = GlobalState.useContainer()

  if (!loaded) return <></>
  if (!token) return <Auth />

  const headers = { Authorization: token } as unknown as Headers
  const config = createConfig(headers)
  return (
    <PusherProvider {...config}>
          { children }
    </PusherProvider>
  )
}

