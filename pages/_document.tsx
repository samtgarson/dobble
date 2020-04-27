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
          <script src="https://cdn.usefathom.com/3.js" site="KPUWCNUE"></script>
        </body>
      </Html>
    )
  }
}

export default DobbleDocument
