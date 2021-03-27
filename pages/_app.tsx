import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import 'rbx/index.css'
import React, { useEffect } from 'react'
import { AuthWrapper } from '~/components/auth-wrapper'
import { GlobalState } from '~/services/state'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'


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
      <AnimatePresence>
        <AuthWrapper key={Component.name}>
          <Component {...pageProps} />
        </AuthWrapper>
      </AnimatePresence>
      <style jsx global>{`
        body, html {
          min-height: 100vh;
          min-height: -webkit-max-available;
          background-color: #6600ff;
          font-family: 'Manrope', sans-serif;
        }
        `}
      </style>
    </GlobalState.Provider>
  )
}

export default App
