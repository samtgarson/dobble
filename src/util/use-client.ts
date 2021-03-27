import Axios, { AxiosError, AxiosInstance } from "axios"
import { useMemo } from "react"
import { GlobalState, StateDispatch } from '../services/state'

export const createClient = (dispatch: StateDispatch, token: string): AxiosInstance => {
  const client = Axios.create({
    headers: {
      Authorization: token
    }
  })

  client.interceptors.response.use(
    response => response,
    // eslint-disable-next-line promise/prefer-await-to-callbacks
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

export const useClient = (): AxiosInstance | void => {
  const { dispatch, token } = GlobalState.useContainer()
  if (!token) return

  const client = useMemo(() => createClient(dispatch, token), [token])
  return client
}
