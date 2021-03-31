import React, { FunctionComponent } from "react"
import { GlobalState } from "~/services/state"
import Welcome from "./welcome"

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const { user, loaded } = GlobalState.useContainer()

  if (!loaded) return <></>

  return user ? <>{ children }</> : <Welcome />
}

