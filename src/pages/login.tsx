import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { Button } from "rbx"
import React from "react"
import { DobbleTitle } from "../components/atoms/title"
import { Wrapper } from "../components/atoms/wrapper"
import { DataClient } from "../services/data-client"
import { GlobalState } from "../services/state"

const googleIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png"

const LogIn: NextPage<{ redirect: string}> = ({ redirect }) => {
  const { user: { auth_id: loggedIn } = {} } = GlobalState.useContainer()
  const client = DataClient.useClient()
  const router = useRouter()

  const login = () => client.auth.signIn({ provider: 'google' }, { redirectTo: new URL(`/auth?redirect=${redirect}`, location.href).toString() })

  if (loggedIn) {
    router.push('/')
    return null
  }

  return (
    <Wrapper>
      <DobbleTitle text='Sign In' />
      <p className="mb-5">Use your Google account to sign into Dobble</p>
      <Button size="large" onClick={login}><img src={googleIcon} style={{ height: '1em', marginRight: 10 }} /> Continue with Google</Button>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query: { redirect = '/' } }) => ({ props: { redirect } })

export default LogIn
