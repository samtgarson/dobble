import { User } from "./api"
import { Omit } from './index'

export type UpdateGame = (cb: (state: Game) => void) => void

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Finished = 'finished',
  Closed = 'closed'
}

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
}

export type FirebasePlayer = User & {
  hand: string[]
}

export interface Game {
  state: GameStatus
  code: string
  owner: string
  players: {
    [id: string]: Player
  }
  stack: Deck
  startAt: string | null
  winner: string | null
  createdAt: Date
}

export interface FirebaseGame extends Omit<Game, 'stack' | 'players'> {
  stack: string[]
  players: {
    [id: string]: FirebasePlayer
  }
}
