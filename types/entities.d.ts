import { User } from './api'
import { Card, Deck, Player } from './game'

export type GameStatus = 'OPEN' | 'PLAYING' | 'FINISHED' | 'CLOSED'

export interface GameEntity {
  id: string
  deck: Deck
  state: GameStatus
  owner_id: string
  created_at: Date
  started_at?: Date
  finished_at?: Date
  winner_id?: string
  next_game_id?: string
  league_id?: string
}

export interface GameEntityWithMeta extends GameEntity {
  top_card: Card
  position: number
  league?: LeagueEntityWithMeta | null
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

export interface LeagueEntity {
  id: string
  members: User[]
  name: string
}

export interface LeagueEntityWithMeta extends LeagueEntity {
  game_count: number
  members: LeaguePlayerEntity[]
}

export type LeagueRole = 'PLAYER' | 'ADMIN'

export interface LeagueMembershipEntity {
  id: string
  user_id: string
  league_id: string
  role: LeagueRole
}

export type LeaguePlayerEntity = {
  id: string
  league_id: string
  cards_left: number
  win_count: number
  membership: LeagueMembershipEntity
  user: User
}
