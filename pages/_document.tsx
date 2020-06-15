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
           <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="https://prawn.samgarson.com/script.js" site="KPUWCNUE" defer spa="true"></script>
        </body>
      </Html>
    )
  }
}

export default DobbleDocument
