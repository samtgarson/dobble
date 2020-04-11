import { createContainer } from 'unstated-next'
import { useReducer, useEffect } from 'react'

export interface State {
  user?: {
    name: string
    id: string
  }
  token?: string
  loaded: boolean
}

const reducer = (state: State, newState: Partial<State>) => {
  return { ...state, ...newState }
}

const useGlobalState = () => {
  const [state, dispatch] = useReducer(reducer, { loaded: false })

  useEffect(() => {
    const existingState = window.localStorage.getItem('dobble_state')
    if (!existingState) return dispatch({ loaded: true })
    dispatch(JSON.parse(existingState))
  }, [])

  useEffect(() => {
    if (!state.token) return
    window.localStorage.setItem('dobble_state', JSON.stringify(state))
  }, [state])

  return { ...state, dispatch }
}

export const GlobalState = createContainer(useGlobalState)
