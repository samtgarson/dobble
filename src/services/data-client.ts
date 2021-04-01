import { createClient, SupabaseClient, SupabaseRealtimePayload } from "@supabase/supabase-js"
import { addSeconds } from "date-fns"
import { User } from "~/types/api"
import { GameEntity, GameEntityWithMeta, GameMembershipEntity, PlayEntity, Players } from "~/types/entities"
import { Card, Deck, GameStatus, Player } from "~/types/game"
import { hydrate } from "../util/hydrate"
import { Dealer } from "./dealer"

export class DataClient {
  static useClient (): DataClient {
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

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

  async getPlayer (userId: string, gameId: string): Promise<Player | null> {
    const { data, error } = await this.client
      .from<Player>('players')
      .select('*')
      .eq('id', userId)
      .eq('game_id', gameId)
      .single()

    if (error) throw error
    return hydrate(data)
  }

  async getPlayers (gameId: string): Promise<Players> {
    const { data, error } = await this.client
      .from<Player>('players')
      .select('*')
      .eq('game_id', gameId)

    if (error) throw error
    if (!data) return {}

    return data.reduce<Players>((hsh, p) => ({ ...hsh, [p.id]: p }), {})
  }

  async joinGame (userId: string, gameId: string): Promise<void> {
    const { error } = await this.client
      .from('game_memberships')
      .insert({ game_id: gameId, user_id: userId }, { returning: 'minimal' })

    if (error) throw error
  }

  async startGame (game: GameEntityWithMeta, players: Players): Promise<void> {
    const playerList = Object.values(players)
    const dealer = new Dealer(playerList.length)
    const { firstCard, hands } = dealer.run()

    const assignHands = hands.map(async (hand, i) => {
      const { error } = await this.client
        .from('game_memberships')
        .update({ hand }, { returning: 'minimal' })
        .eq('game_id', game.id)
        .eq('user_id', playerList[i].id)

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

  async finishGame (gameId: string, userId: string): Promise<void> {
    const newAttrs = { winner_id: userId, state: GameStatus.Finished, finished_at: new Date() }
    const { error } = await this.client
      .from<GameEntity>('games')
      .update(newAttrs, { returning: 'minimal' })
      .eq('id', gameId)

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
      .select('*')
      .eq('id', gameId)
      .eq('players.game_id' as keyof GameEntityWithMeta, gameId)
      .single()

    if (error) throw error
    if (!data) return

    return hydrate(data)
  }

  async playCard (gameId: string, player: Player, position: number): Promise<void> {
    const card = player.hand.shift()
    if (!card) return

    await this.createPlay(gameId, player.id, position, card)
    await this.updateHand(player.id, gameId, player.hand)

    if (player.hand.length == 0) this.finishGame(gameId, player.id)
  }

  async updateHand (userId: string, gameId: string, hand: Deck): Promise<void> {
    const { error } = await this.client
      .from('game_memberships')
      .update({ hand })
      .eq('game_id', gameId)
      .eq('user_id', userId)

    if (error) throw error
  }

  async createAnotherGame (userId: string, gameId: string): Promise<string> {
    const { id: next_game_id } = await this.createGame(userId)
    const { error } = await this.client
      .from<GameEntity>('games')
      .update({ next_game_id }, { returning: 'minimal' })
      .eq('id', gameId)

    if (error) throw error

    return next_game_id
  }

  subscribeToGame (originalGame: GameEntityWithMeta, update: (game: GameEntityWithMeta) => void): () => void {
    let game = originalGame
    const save = (g: GameEntityWithMeta) => {
      game = hydrate(g)
      update(game)
    }

    const gameSub = this.client.from<GameEntity>(`games:id=eq.${game.id}`).on(
      'UPDATE',
      payload => save({ ...game, ...payload.new })
    ).subscribe()

    const playSub = this.client.from<PlayEntity>(`plays:game_id=eq.${game.id}`).on(
      'INSERT',
      payload => save({ ...game, top_card: payload.new.card, position: payload.new.position })
    ).subscribe()

    return () => {
      this.client.removeSubscription(gameSub)
      this.client.removeSubscription(playSub)
    }
  }

  subscribeToPlayers (gameId: string, originalPlayers: Players, update: (players: Players) => void): () => void {
    let players = originalPlayers
    const save = (p: Players) => {
      players = hydrate(p)
      update(players)
    }

    const sub = this.client.from<GameMembershipEntity>(`game_memberships:game_id=eq.${gameId}`)
      .on('UPDATE', async payload => {
        const { hand, user_id } = payload.new
        save({ ...players, [user_id]: { ...players[user_id], hand } })
      })
      .on('INSERT', async (payload: SupabaseRealtimePayload<GameMembershipEntity>) => {
        const player = await this.getPlayer(payload.new.user_id, gameId)
        if (!player) return

        save({ ...players, [player.id]: player })
      })
      .subscribe()

    return () => {
      this.client.removeSubscription(sub)
    }
  }

}
