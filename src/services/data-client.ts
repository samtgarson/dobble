import { SupabaseClient } from "@supabase/supabase-js"
import { useSupabase } from "use-supabase"
import { User } from "~/types/api"
import { GameEntity, GameEntityWithPlayers } from "~/types/entities"

export class DataClient {
  static useClient (): DataClient {
    const client = useSupabase()
    return new DataClient(client)
  }

  constructor (
    private client: SupabaseClient
  ) {}

  async createUser (name: string): Promise<User> {
    const { data, error } = await this.client
      .from<User>('users')
      .insert({ name })
      .single()

    if (error) throw error
    if (!data) throw new Error('Could not create user')

    return data
  }

  async joinGame (userId: string, gameId: string): Promise<void> {
    const { error } = await this.client
      .from('game_memberships')
      .insert({ game_id: gameId, user_id: userId }, { returning: 'minimal' })

    if (error) throw error
  }

  async createGame (userId: string): Promise<GameEntity> {
    const { data, error } = await this.client
      .from<GameEntity>('games')
      .insert({ owner_id: userId })
      .single()

    if (error) throw error
    if (!data) throw new Error('Could not create game')

    await this.joinGame(userId, data.id)

    return data
  }

  async getGame (userId: string, gameId: string): Promise<GameEntityWithPlayers | undefined> {
    const { data, error } = await this.client
      .from<GameEntityWithPlayers>('games')
      .select('*, players(*)')
      .eq('id', gameId)
      .single()

    if (error) throw error
    if (!data) return

    return data
  }
}
