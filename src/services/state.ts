import { createContainer } from 'unstated-next'
import { useReducer, useEffect, Dispatch } from 'react'
import { User } from '~/types/api'

export interface State {
  user?: User
  loaded: boolean
}

export type StateDispatch = Dispatch<Partial<State>>

const STORAGE_KEY = 'dobble_state'

const reducer = (state: State, newState: Partial<State>) => {
  return { ...state, ...newState }
}

const useGlobalState = () => {
  const [state, dispatch] = useReducer(reducer, { loaded: false })

  useEffect(() => {
    const existingState = window.localStorage.getItem(STORAGE_KEY)
    if (!existingState) return dispatch({ loaded: true })
    dispatch(JSON.parse(existingState))
  }, [])

  useEffect(() => {
    if (!state.user) return window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return { ...state, dispatch }
}

export const GlobalState = createContainer(useGlobalState)
