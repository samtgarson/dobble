import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class DobbleDocument extends Document {
  render () {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;600&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <style jsx global>{`
            body, html {
              min-height: 100vh;
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
        </body>
      </Html>
    )
  }
}

export default DobbleDocument
