import React from 'react'
import { AppProps } from 'next/app'
import { AnimatePresence  } from 'framer-motion'
import { GlobalState } from '~/services/state'
import 'rbx/index.css'
import { AuthWrapper } from '~/components/auth-wrapper'

const App = ({ Component, pageProps }: AppProps) => (
  <GlobalState.Provider>
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

export default App
