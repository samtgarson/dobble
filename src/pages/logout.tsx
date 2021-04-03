import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { DataClient } from "../services/data-client"
import { GlobalState } from "../services/state"

const LogOut: NextPage = () => {
  const { dispatch } = GlobalState.useContainer()
  const client = DataClient.useClient()
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await client.auth.signOut()
      dispatch({ user: undefined })
      router.push('/')
    }

    logout()
  }, [])

  return null
}

export default LogOut
