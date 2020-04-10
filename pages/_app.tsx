import { AppProps } from 'next/app'
import { RoomServiceProvider } from "@roomservice/react"
import { FunctionComponent, ReactElement } from 'react'
import Auth from '~/components/auth'
import { GlobalState } from '~/services/state'

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
  </GlobalState.Provider>
)

export default App
