import { User } from './api'
import { Card, Deck, GameStatus, Player } from './game'

export interface GameEntity {
  id: string
  deck: Deck
  state: GameStatus
  owner_id: string
  created_at: Date
  started_at?: Date
  finished_at?: Date
  winner_id?: string
}

export interface GameEntityWithMeta extends GameEntity {
  top_card: Card
  position: number
}

export interface PlayEntity {
  id: string
  game_id: string
  user_id: string
  card: Card
  position: number
}

export interface GameMembershipEntity {
  id: string
  user_id: string
  game_id: string
  hand: Deck
}

export type Players = Record<string, Player>
