import { AppProps } from 'next/app'
import { PusherProvider, PusherProviderProps } from '@harelpls/use-pusher'
import React, { FunctionComponent } from 'react'
import Auth from '~/components/auth'
import { GlobalState } from '~/services/state'
import 'rbx/index.css'

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

const AuthWrapper: FunctionComponent = ({ children }) => {
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

const App = ({ Component, pageProps }: AppProps) => (
  <GlobalState.Provider>
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
    <style jsx global>{`
      body, html {
        min-height: 100vh;
        background-color: #fafafa;
      }

      .container {
        border-radius: 10px;
        background-color: white;
        padding: 20px;
        max-width: 550px;
      }
    `}
    </style>
  </GlobalState.Provider>
)

export default App
