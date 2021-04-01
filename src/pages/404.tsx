import { NextPage } from "next"
import { Wrapper } from "~/components/wrapper"
import { DobbleTitle } from '~/components/title'
import React from "react"
import Link from "next/link"
import { Button } from "rbx"

const FourOhFour: NextPage = () => (
  <Wrapper>
    <DobbleTitle text="404 Not Found" />
    <p style={{ marginBottom: 20 }}>That page could not be found 😞</p>
    <Link href='/'><Button color='light' as='a'>Back home</Button></Link>
  </Wrapper>
)

export default FourOhFour
