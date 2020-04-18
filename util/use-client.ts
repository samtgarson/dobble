import Axios, { AxiosError } from "axios"
import { GlobalState, StateDispatch } from '../services/state'
import { useMemo } from "react"

export const createClient = (dispatch: StateDispatch, token: string) => {
  const client = Axios.create({
    headers: {
      Authorization: token
    }
  })

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error && error.response && error.response.status === 401) {
        dispatch({ user: undefined, token: undefined })
        return Promise.reject(undefined)
      }

      Promise.reject(error)
    }
  )

  return client
}

export const useClient = () => {
  const { dispatch, token } = GlobalState.useContainer()
  if (!token) return

  const client = useMemo(() => createClient(dispatch, token), [token])
  return client
}
