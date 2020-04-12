import { User } from "./api"

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Closed = 'closed'
}

export interface Game {
  state: GameStatus
  code: string
  owner: string
  players: {
    [id: string]: User
  }
}
