import { User } from './api'
import { Deck, GameStatus, Player } from './game'

export interface GameEntity {
  id: string
  deck: Deck
  state: GameStatus
  owner_id: string
}

export interface GameEntityWithPlayers extends GameEntity {
  players: Player[]
}
