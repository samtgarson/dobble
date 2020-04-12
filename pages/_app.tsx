import { AppProps } from 'next/app'
import { RoomServiceProvider } from "@roomservice/react"
import React, { FunctionComponent, ReactElement } from 'react'
import Auth from '~/components/auth'
import { GlobalState } from '~/services/state'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import 'rbx/index.css'

if (typeof window !== 'undefined'
    && process.env.NODE_ENV === 'development'
    && process.env.DOBBLE_TRACE
) {
  whyDidYouRender(React)
}

type AuthWrapperProps = {
  children: (headers: Headers) => ReactElement
}
const AuthWrapper: FunctionComponent<AuthWrapperProps> = ({ children }) => {
  const { token, loaded } = GlobalState.useContainer()

  if (!loaded) return <></>
  if (!token) return <Auth />

  const headers = { Authorization: token } as unknown as Headers
  return children(headers) as React.ReactElement
}

const App = ({ Component, pageProps }: AppProps) => (
  <GlobalState.Provider>
    <AuthWrapper>{ headers =>
      <RoomServiceProvider authUrl={"/api/roomservice"} headers={headers}>
        <Component {...pageProps} />
      </RoomServiceProvider>
    }</AuthWrapper>
    <style jsx global>{`
      body {
        min-height: 100vh;
        background-color: #fafafa;
      }

      .container {
        border-radius: 10px;
        background-color: white;
        padding: 20px;
        max-width: 550px;
      }
    `}</style>
  </GlobalState.Provider>
)

export default App
