import { createClient } from "@supabase/supabase-js"
import React, { FunctionComponent } from "react"
import { SupabaseContextProvider } from "use-supabase"
import { GlobalState } from "~/services/state"
import Welcome from "./welcome"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

export const AuthWrapper: FunctionComponent = ({ children }) => {
  const { user, loaded } = GlobalState.useContainer()

  if (!loaded) return <></>
  if (!user) return <Welcome />

  return (
    <SupabaseContextProvider client={supabase}>
      { children }
    </SupabaseContextProvider>
  )
}

