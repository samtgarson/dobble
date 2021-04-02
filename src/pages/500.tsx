import { NextPage } from "next"
import { Wrapper } from "~/components/wrapper"
import { DobbleTitle } from '~/components/title'
import React from "react"
import Link from "next/link"
import { Button } from "rbx"

const FiveHundred: NextPage = () => (
  <Wrapper>
    <DobbleTitle text="500 Server Error" />
    <p style={{ marginBottom: 20 }}>Something went wrong 😳</p>
    <Link href='/'><Button color='light' as='a'>Back home</Button></Link>
  </Wrapper>
)

export default FiveHundred
