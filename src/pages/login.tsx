import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"
import { DataClient } from "../services/data-client"

const LogIn: NextPage<{ redirect: string}> = ({ redirect }) => {
  const client = DataClient.useClient()

  useEffect(() => {
    client.auth.signIn({ provider: 'google' }, { redirectTo: new URL(`/auth?redirect=${redirect}`, location.href).toString() })
  })

  return null
}

export const getServerSideProps: GetServerSideProps = async ({ query: { redirect = '/' } }) => ({ props: { redirect } })

export default LogIn
