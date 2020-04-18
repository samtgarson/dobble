import { User } from "./api"
import { Omit } from './index'

export type UpdateGame = (cb: (state: Game) => void) => void

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Closed = 'closed'
}

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
  online?: boolean
}

export type FirebasePlayer = User & {
  hand: string[]
  online?: boolean
}

export interface Game {
  state: GameStatus
  code: string
  owner: string
  players: {
    [id: string]: Player
  }
  stack: Deck
}

export interface FirebaseGame extends Omit<Game, 'stack' | 'players'> {
  stack: string[]
  players: {
    [id: string]: FirebasePlayer
  }
}
