import React from 'react'
import { AppProps } from 'next/app'
import { GlobalState } from '~/services/state'
import 'rbx/index.css'
import { AuthWrapper } from '~/components/auth-wrapper'

const App = ({ Component, pageProps }: AppProps) => (
  <GlobalState.Provider>
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
    <style jsx global>{`
      body, html {
        min-height: 100vh;
        min-height: -webkit-max-available;
        background-color: #6100d9;
        font-family: 'Manrope', sans-serif;
      }

      .container {
        padding: 20px;
        max-width: 550px;
        border-radius: 10px;
        background: white;
        box-shadow:  20px 20px 60px #5200b8,
          -20px -20px 60px #7000fa;
      }

      @media (max-width: 400px) {
        .container {
          padding: 10px;
        }
      }
    `}
    </style>
  </GlobalState.Provider>
)

export default App
