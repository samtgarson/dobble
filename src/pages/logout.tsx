import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { GlobalState } from "../services/state"

const LogOut: NextPage = () => {
  const { dispatch } = GlobalState.useContainer()
  const router = useRouter()

  useEffect(() => {
    dispatch({ user: undefined })
    router.replace('/')
  })

  return null
}

export default LogOut
