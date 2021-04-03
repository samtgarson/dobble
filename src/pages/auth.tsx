import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"
import { useRouter } from 'next/router'
import { GlobalState } from "../services/state"

const Auth: NextPage<{ redirect: string }> = ({ redirect }) => {
  const router = useRouter()
  const { user: { auth_id: loggedIn } = {} } = GlobalState.useContainer()

  useEffect(() => {
    if (loggedIn) router.push(redirect)
  }, [loggedIn])

  return null
}

export const getServerSideProps: GetServerSideProps = async ({ query: { redirect = '/' } }) => ({ props: { redirect } })

export default Auth
