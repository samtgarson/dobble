import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import 'src/styles/global.scss'
import { AuthWrapper } from '~/components/auth/auth-wrapper'
import { GlobalState } from '~/services/state'
import { NavBar } from '../components/nav-bar'
import { useFathom } from '../util/use-fathom'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <GlobalState.Provider>
      <Head>
        <title>Dobble</title>
          <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <NavBar />
      <AuthWrapper key={Component.name}>
        <Component {...pageProps} />
      </AuthWrapper>
    </GlobalState.Provider>
  )
}

export default App
