import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GlobalState } from '../services/state'

const Auth: NextPage<{ redirect: string }> = ({ redirect }) => {
  const router = useRouter()
  const { user: { auth_id: loggedIn } = {} } = GlobalState.useContainer()

  useEffect(() => {
    if (loggedIn) router.push(redirect)
  }, [loggedIn])

  return null
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { redirect = '/' }
}) => ({ props: { redirect } })

export default Auth
