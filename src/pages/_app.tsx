import * as Fathom from 'fathom-client'
import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import 'src/styles/global.scss'
import { AuthWrapper } from '~/components/auth-wrapper'
import { GlobalState } from '~/services/state'
import { NavBar } from '../components/nav-bar'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('KPUWCNUE', {
      url: 'https://prawn.samgarson.com/script.js',
      spa: 'auto',
      includedDomains: ['dobble.samgarson.com']
    })

    function onRouteChangeComplete () {
      Fathom.trackPageview()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return (
    <GlobalState.Provider>
      <Head>
        <title>Dobble</title>
          <link
          rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;600&display=swap"
          />
          <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <NavBar />
      <AnimatePresence>
        <AuthWrapper key={Component.name}>
          <Component {...pageProps} />
        </AuthWrapper>
      </AnimatePresence>
    </GlobalState.Provider>
  )
}

export default App
