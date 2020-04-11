import { User } from "./api";

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Closed = 'closed'
}

export interface Player extends User {
  points: number
}

export interface Game {
  state: GameStatus
  code: string
  players: {
    [id: string]: Player
  }
}
