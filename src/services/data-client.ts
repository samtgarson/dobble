import { SupabaseClient } from "@supabase/supabase-js"
import { addSeconds } from "date-fns"
import { useSupabase } from "use-supabase"
import { User } from "~/types/api"
import { GameEntity, GameEntityWithMeta, PlayEntity } from "~/types/entities"
import { Card, GameStatus } from "~/types/game"
import { hydrate } from "../util/hydrate"
import { Dealer } from "./dealer"

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

    return hydrate(data)
  }

  async joinGame (userId: string, gameId: string): Promise<void> {
    const { error } = await this.client
      .from('game_memberships')
      .insert({ game_id: gameId, user_id: userId }, { returning: 'minimal' })

    if (error) throw error
  }

  async startGame (game: GameEntityWithMeta): Promise<void> {
    const dealer = new Dealer(game.players.length)
    const { firstCard, hands } = dealer.run()

    const assignHands = hands.map(async (hand, i) => {
      const { error } = await this.client
        .from('game_memberships')
        .update({ hand }, { returning: 'minimal' })
        .eq('game_id', game.id)
        .eq('user_id', game.players[i].id)

      if (error) throw error
    })

    await Promise.all([...assignHands, this.createPlay(game.id, game.owner_id, 0, firstCard)])

    const startedAt = addSeconds(new Date(), 5)
    const { error } = await this.client
      .from<GameEntity>('games')
      .update({ started_at: startedAt, state: GameStatus.Playing }, { returning: 'minimal' })
      .eq('id', game.id)

    if (error) throw error
  }

  async createPlay (game_id: string, user_id: string, position: number, card: Card): Promise<void> {
    const { error } = await this.client
      .from<PlayEntity>('plays')
      .insert({ user_id, game_id, position, card }, { returning: 'minimal' })

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

    return hydrate(data)
  }

  async getGame (gameId: string): Promise<GameEntityWithMeta | undefined> {
    const { data, error } = await this.client
      .from<GameEntityWithMeta>('games_with_meta')
      .select('*, players(*)')
      .eq('id', gameId)
      .eq('players.game_id' as keyof GameEntityWithMeta, gameId)
      .single()

    if (error) throw error
    if (!data) return

    return hydrate(data)
  }

  subscribeToGame (originalGame: GameEntityWithMeta, update: (game: GameEntityWithMeta) => void): () => void {
    let game = originalGame
    const save = (g: GameEntityWithMeta) => {
      console.log(g)
      game = hydrate(g)
      update(game)
    }

    this.client.from<GameEntity>(`games:id=eq.${game.id}`).on(
      'UPDATE',
      payload => save({ ...game, ...payload.new })
    ).subscribe()

    this.client.from(`game_memberships:game_id=eq.${game.id}`).on(
      '*',
      async _ => {
        const newGame = await this.getGame(game.id)
        if (newGame) save(newGame)
      }
    ).subscribe()

    this.client.from<PlayEntity>(`plays:game_id=eq.${game.id}`).on(
      'INSERT',
      payload => save({ ...game, top_card: payload.new.card })
    ).subscribe()

    return () => {
      this.client.getSubscriptions().forEach(sub =>
        this.client.removeSubscription(sub)
      )
    }
  }
}
