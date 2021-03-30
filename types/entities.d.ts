import { User } from './api'
import { Card, Deck, GameStatus, Player } from './game'

export interface GameEntity {
  id: string
  deck: Deck
  state: GameStatus
  owner_id: string
  created_at: Date
  started_at?: Date
}

export interface GameEntityWithMeta extends GameEntity {
  players: Player[]
  top_card: Card
}

export interface PlayEntity {
  id: string
  game_id: string
  user_id: string
  card: Card
  position: number
}
